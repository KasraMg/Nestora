const AppError = require("../../utils/AppError");
const Ticket = require("./ticket.model");

exports.createTicket = async (user, data) => {
  const { title, body } = data;
  if (!title || !body) {
    throw new AppError("لطفا عنوان و پیام خود را ارسال کنید", 400);
  }

  const ticket = new Ticket({
    title,
    isUnreadForAdmin: true,
    isUnreadForUser: false,
    messages: [
      {
        body,
        sender: "user",
      },
    ],
    user: user._id,
    status: "open",
  });

  return await ticket.save();
};

exports.getUserTickets = async (user) => {
  return await Ticket.find({ user: user._id });
};

exports.getTicket = async (id, user) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new AppError("تیکتی با این شناسه یافت نشد", 404);
  } 

  if (ticket.user.equals(user._id) || user.role == "admin") {
    return ticket;
  } else {
    throw new AppError("شما دسترسی برای دریافت این تیکت ندارید", 403);
  }
};

exports.toggleTicketStatus = async (user, id) => {
  if (user.role !== "admin") {
    throw new AppError("شما دسترسی انجام این عملیات را ندارید", 403);
  }

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new AppError("تیکت یافت نشد", 404);
  }

  ticket.status = ticket.status === "open" ? "closed" : "open";

  await ticket.save();

  return ticket;
};
exports.addMessageToTicket = async (user, ticketId, data) => {
  const { body } = data;

  if (!body) {
    throw new AppError("متن پیام الزامی است", 400);
  }

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new AppError("تیکت یافت نشد", 404);
  }

  ticket.messages.push({
    body,
    sender: user.role === "admin" ? "admin" : "user",
  });

  ticket.isUnreadForAdmin = user.role !== "admin";
  ticket.isUnreadForUser = user.role === "admin";

  await ticket.save();

  return ticket;
};
