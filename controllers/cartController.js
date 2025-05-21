const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = async (request, response) => {
  const { name } = request.body;
  console.log("Dodano do koszyka:", name);

  if (!name) {
    return response
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ error: "Product name is required" });
  }

  try {
    const product = await Product.findByName(name);
    if (!product) {
      return response
        .status(STATUS_CODE.NOT_FOUND)
        .json({ error: "Product not found" });
    }

    await Cart.add(name);
    return response.sendStatus(STATUS_CODE.OK);
  } catch (error) {
    console.error("Add to cart error:", error);
    return response
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

exports.getProductsCount = async () => {
  try {
    return await Cart.getProductsQuantity();
  } catch (error) {
    console.error("Error getting products count:", error);
    return 0;
  }
};
