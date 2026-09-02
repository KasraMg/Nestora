const Order = require("../order/order.model");
const User = require("../user/user.model");
const Product = require("../product/products.model");

const getAdminStats = async () => {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - 30);

  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - 30);

  const sixMonthsStart = new Date(now);
  sixMonthsStart.setMonth(sixMonthsStart.getMonth() - 5);
  sixMonthsStart.setDate(1);
  sixMonthsStart.setHours(0, 0, 0, 0);

  const calculateGrowth = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(2));
  };

  const lastOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("user", "name phone email")
    .populate("products.product");

  const [
    currentSales,
    newOrders,
    newCustomers,
    activeProducts,

    previousSales,
    previousOrders,
    previousCustomers,

    salesChart,

    monthlySales,
    monthlyCustomers,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentStart,
            $lte: now,
          },
          status: "successfull",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),

    Order.countDocuments({
      createdAt: {
        $gte: currentStart,
        $lte: now,
      },
    }),

    User.countDocuments({
      createdAt: {
        $gte: currentStart,
        $lte: now,
      },
      role: "user",
    }),

    Product.countDocuments(),

    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousStart,
            $lt: currentStart,
          },
          status: "successfull",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),

    Order.countDocuments({
      createdAt: {
        $gte: previousStart,
        $lt: currentStart,
      },
    }),

    User.countDocuments({
      createdAt: {
        $gte: previousStart,
        $lt: currentStart,
      },
      role: "user",
    }),

    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentStart,
            $lte: now,
          },
          status: "successfull",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          total: {
            $sum: "$totalPrice",
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sixMonthsStart,
            $lte: now,
          },
          status: "successfull",
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },

          sales: {
            $sum: "$totalPrice",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sixMonthsStart,
            $lte: now,
          },
          role: "user",
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },

          customers: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]),
  ]);

  const sales = currentSales[0]?.total || 0;

  const salesMap = new Map(
    monthlySales.map((item) => [
      item._id,
      {
        sales: item.sales,
        orders: item.orders,
      },
    ]),
  );

  const customersMap = new Map(
    monthlyCustomers.map((item) => [item._id, item.customers]),
  );

  const growthChart = [];

  for (let i = 0; i < 6; i++) {
    const date = new Date(sixMonthsStart);

    date.setMonth(sixMonthsStart.getMonth() + i);

    const month = date.toISOString().slice(0, 7);

    const currentMonth = salesMap.get(month);

    const salesValue = currentMonth?.sales || 0;
    const ordersValue = currentMonth?.orders || 0;
    const customersValue = customersMap.get(month) || 0;

    growthChart.push({
      month,

      sales: salesValue,

      orders: ordersValue,

      customers: customersValue,
    });
  }

  return {
    overview: {
      totalSales: sales,
      newOrders,
      newCustomers,
      activeProducts,
    },

    salesChart: salesChart.map((item) => ({
      date: item._id,
      sales: item.total,
    })),
    lastOrders,
    growthChart,
  };
};

module.exports = {
  getAdminStats,
};
