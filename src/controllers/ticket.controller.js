const ticketService = require("../services/ticket.service");

exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.user, req.body);
    res.status(201).json({
      message: "تیکت با موفقیت ثبت شد",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getUsetTickets(req.user);
    res.status(200).json({
      message: "لیست تیکت ها با موفقیت دریافت شد",
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

exports.addMessageToTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.addMessageToTicket(
      req.user,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      message: "پیام با موفقیت ثبت شد",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleTicketStatus = async (req, res, next) => {
  try {
    await ticketService.toggleTicketStatus(req.user, req.params.id);

    res.status(200).json({
      message: "وضعیت تیکت با موفقیت تغییر کرد",
    });
  } catch (error) {
    next(error);
  }
}
