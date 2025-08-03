import React, { useState } from "react";
import { Plus, Minus, Trash2, ShoppingCart, X, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getproducts, imageBase } from "../../services/apis";
import { useSelector } from "react-redux";

// Mock customization options - you can fetch these from your API
const customizationOptions = {
  extras: [
    { id: "extra_cheese", name: "Extra Cheese", price: 2.5 },
    { id: "extra_bacon", name: "Extra Bacon", price: 3.0 },
    { id: "extra_mushrooms", name: "Extra Mushrooms", price: 1.5 },
    { id: "extra_peppers", name: "Extra Peppers", price: 1.0 },
    { id: "extra_onions", name: "Extra Onions", price: 1.0 },
  ],
  removals: [
    { id: "no_tomato", name: "No Tomato", price: 0 },
    { id: "no_onions", name: "No Onions", price: 0 },
    { id: "no_pickles", name: "No Pickles", price: 0 },
    { id: "no_lettuce", name: "No Lettuce", price: 0 },
    { id: "no_sauce", name: "No Sauce", price: 0 },
  ],
  //   sizes: [
  //     { id: 'small', name: 'Small', price: 0 },
  //     { id: 'medium', name: 'Medium', price: 2.00 },
  //     { id: 'large', name: 'Large', price: 4.00 },
  //   ]
};

export default function MakeOrder() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [showCustomization, setShowCustomization] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [myData, setMydata] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false); // For mobile cart toggle
  const [customizations, setCustomizations] = useState({
    extras: [],
    removals: [],
    size: "small",
    specialInstructions: "",
  });
  const token = useSelector((store) => store.user.token);

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-products"],
    queryFn: async () => {
      const res = await getproducts(token);
      setFilterOptions([...new Set(res?.map((ele) => ele.subCategory))]);

      setMydata(res);
    },
  });

  // Reset customizations
  const resetCustomizations = () => {
    setCustomizations({
      extras: [],
      removals: [],
      size: "small",
      specialInstructions: "",
    });
  };

  // Open customization modal
  const openCustomization = (product) => {
    setSelectedProduct(product);
    resetCustomizations();
    setShowCustomization(true);
  };

  // Close customization modal
  const closeCustomization = () => {
    setShowCustomization(false);
    setSelectedProduct(null);
    resetCustomizations();
  };

  // Handle customization changes
  const handleCustomizationChange = (type, itemId, checked = null) => {
    if (type === "size") {
      setCustomizations((prev) => ({ ...prev, size: itemId }));
    } else if (type === "specialInstructions") {
      setCustomizations((prev) => ({ ...prev, specialInstructions: itemId }));
    } else {
      setCustomizations((prev) => ({
        ...prev,
        [type]: checked
          ? [...prev[type], itemId]
          : prev[type].filter((id) => id !== itemId),
      }));
    }
  };

  // Calculate customization price
  const calculateCustomizationPrice = () => {
    let price = 0;

    // Add size price

    // Add extras price
    customizations.extras.forEach((extraId) => {
      const extra = customizationOptions.extras.find((e) => e.id === extraId);
      if (extra) price += extra.price;
    });

    return price;
  };

  // Add to cart with customizations
  const addToCartWithCustomizations = () => {
    if (!selectedProduct) return;

    const customizationPrice = calculateCustomizationPrice();
    const itemPrice = selectedProduct.price + customizationPrice;

    // Get detailed extras with prices
    const extrasWithPrices = customizations.extras.map((extraId) => {
      const extra = customizationOptions.extras.find((e) => e.id === extraId);
      return {
        id: extra.id,
        name: extra.name,
        price: extra.price,
      };
    });

    // Get detailed removals
    const removalsWithDetails = customizations.removals.map((removalId) => {
      const removal = customizationOptions.removals.find(
        (r) => r.id === removalId
      );
      return {
        id: removal.id,
        name: removal.name,
        price: removal.price,
      };
    });

    const customizedProduct = {
      ...selectedProduct,
      customizations: {
        ...customizations,
        extrasWithPrices, // Add detailed extras with prices
        removalsWithDetails, // Add detailed removals
      },
      customizationPrice,
      finalPrice: itemPrice,
      uniqueId: `${selectedProduct._id}_${Date.now()}_${Math.random()}`, // Unique ID for customized items
    };

    const existingItemIndex = cart.findIndex(
      (item) =>
        item._id === selectedProduct._id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...customizedProduct, quantity: 1 }]);
    }

    setTotal(total + itemPrice);
    closeCustomization();
  };

  // Simple add to cart (without customization)
  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item._id === product._id && !item.customizations
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === product._id && !item.customizations
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, finalPrice: product.price },
      ]);
    }

    setTotal(total + product.price);
  };

  const updateQuantity = (uniqueId, change) => {
    const updatedCart = cart
      .map((item) => {
        const itemId = item.uniqueId || item._id;
        if (itemId === uniqueId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            setTotal(total - (item.finalPrice || item.price) * item.quantity);
            return null;
          }
          setTotal(total + (item.finalPrice || item.price) * change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean);

    setCart(updatedCart);
  };

  const removeFromCart = (uniqueId) => {
    const itemId = uniqueId;
    const item = cart.find((item) => (item.uniqueId || item._id) === itemId);
    if (item) {
      setTotal(total - (item.finalPrice || item.price) * item.quantity);
      setCart(cart.filter((item) => (item.uniqueId || item._id) !== itemId));
    }
  };

  const clearCart = () => {
    setCart([]);
    setTotal(0);
  };

  let allData = [];

  if (filterValue) {
    allData = myData.filter(
      (ele) => ele.subCategory.title == filterValue.title
    );
  } else {
    allData = myData;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 w-full">
      {/* Mobile Cart Toggle Button */}
      <div className="xl:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 ms-auto  w-full">
        {/* Products Section */}
        <div className="flex-1  lg:max-w-4xl backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text ml-4 flex items-center justify-between  w-full">
              <div>Menu Items</div>
              <button
                onClick={() => setFilterValue("")}
                className="text-base font-bold bg-popular rounded-md px-3 py-1"
              >
                Clear
              </button>
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 mb-4 lg:mb-6 hide-scrollbar-order">
            {filterOptions?.map((ele, index) => (
              <button
                onClick={() => setFilterValue(ele)}
                className="flex-shrink-0 hover:scale-105 transition-transform duration-200 my-2"
                key={index}
              >
                <img
                  className="w-[80px] h-[80px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] rounded-full object-cover border-4 border-transparent hover:border-popular transition-colors duration-200"
                  src={`${imageBase}${ele?.image}`}
                  alt={ele?.title || "Category"}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/120x120/purple/white?text=Category";
                  }}
                />
                <p className="text-center text-xs sm:text-sm font-medium text-white mt-2 truncate max-w-[80px] sm:max-w-[100px] lg:max-w-[120px]">
                  {ele?.title || "Category"}
                </p>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {allData?.map((product) => (
              <div
                key={product._id}
                className="bg-secondary rounded-xl lg:rounded-2xl my-2 lg:my-3 pb-4 lg:pb-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-popular group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-full h-[120px] sm:h-[140px] lg:h-[150px] overflow-hidden mb-3 lg:mb-4 transition-transform duration-300">
                    <img
                      className="w-full h-full object-cover rounded-lg lg:rounded-xl rounded-b-none"
                      src={`${imageBase}/${product?.image}`}
                      alt={product?.title}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150x150/purple/white?text=No+Image";
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-xs sm:text-sm leading-tight px-2">
                    {product?.title}
                  </h3>

                  <div className="text-xs sm:text-sm font-bold text-popular mb-3 lg:mb-4">
                    {product.price?.toFixed(2) || "0.00"} EG
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 px-2 w-full">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 w-full"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Quick Add
                    </button>
                    <button
                      onClick={() => openCustomization(product)}
                      className="bg-popular hover:bg-popular/50 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 w-full"
                    >
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section - Desktop - IMPROVED */}
        <div className="hidden xl:block w-full lg:w-96 xl:w-[420px] 2xl:w-[480px] bg-secondary text-white backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 xl:w-7 xl:h-7" />
              Order Summary
            </h3>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5 xl:w-6 xl:h-6" />
              </button>
            )}
          </div>

          <div className="space-y-4 mb-8 overflow-y-auto max-h-[50vh] xl:max-h-[55vh]">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 xl:w-20 xl:h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base xl:text-lg">
                  No items in order
                </p>
                <p className="text-sm xl:text-base text-gray-400 mt-2">
                  Click on menu items to add them
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const itemId = item.uniqueId || item._id;
                return (
                  <div
                    key={itemId}
                    className="bg-black text-white rounded-xl p-4 xl:p-5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-3">
                        <h4 className="font-semibold text-sm xl:text-base">
                          {item.title}
                        </h4>

                        {/* Show base price and extras separately */}
                        <div className="text-xs xl:text-sm mt-2 space-y-1">
                          <div className="text-gray-300">
                            <span className="font-medium">Base Price:</span>
                            {item.price?.toFixed(2) || "0.00"} EG
                          </div>

                          {item.customizationPrice > 0 && (
                            <div className="text-yellow-400">
                              <span className="font-medium">Extras:</span> +EG
                              {item.customizationPrice?.toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Show customizations with individual prices */}
                        {item.customizations && (
                          <div className="text-xs xl:text-sm mt-2 space-y-1">
                            {item.customizations.extrasWithPrices &&
                              item.customizations.extrasWithPrices.length >
                                0 && (
                                <div className="text-green-400">
                                  <span className="font-medium">Added:</span>
                                  <div className="ml-2 space-y-1">
                                    {item.customizations.extrasWithPrices.map(
                                      (extra, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between"
                                        >
                                          <span>• {extra.name}</span>
                                          <span>
                                            {extra.price.toFixed(2)} EG
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            {item.customizations.removalsWithDetails &&
                              item.customizations.removalsWithDetails.length >
                                0 && (
                                <div className="text-orange-400">
                                  <span className="font-medium">Remove:</span>{" "}
                                  {item.customizations.removalsWithDetails
                                    .map((removal) => removal.name)
                                    .join(", ")}
                                </div>
                              )}
                            {item.customizations.specialInstructions && (
                              <div className="text-blue-400">
                                <span className="font-medium">Note:</span>{" "}
                                {item.customizations.specialInstructions}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-popular font-bold text-sm xl:text-base mt-2">
                          Total:
                          {(item.finalPrice || item.price)?.toFixed(2) ||
                            "0.00"}{" "}
                          EG
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(itemId);
                        }}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 xl:w-5 xl:h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(itemId, -1);
                          }}
                          className="w-9 h-9 xl:w-10 xl:h-10 bg-purple-100 hover:bg-purple-200 text-popular rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4 xl:w-5 xl:h-5" />
                        </button>
                        <span className="font-bold text-lg xl:text-xl w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(itemId, 1);
                          }}
                          className="w-9 h-9 xl:w-10 xl:h-10 bg-purple-100 hover:bg-purple-200 text-popular rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4 xl:w-5 xl:h-5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs xl:text-sm text-gray-400">
                          {(
                            (item.finalPrice || item.price) * item.quantity
                          ).toFixed(2)}{" "}
                          EG
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-600 pt-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm xl:text-base font-medium">
                    Subtotal:
                  </span>
                  <span className="text-base xl:text-lg font-semibold text-popular">
                    {total.toFixed(2)} EG
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm xl:text-base font-medium">
                    VAT (20%):
                  </span>
                  <span className="text-base xl:text-lg font-semibold text-popular">
                    {(total * 0.2).toFixed(2)} EG
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                  <span className="text-base xl:text-lg font-bold">Total:</span>
                  <span className="text-lg xl:text-xl font-bold text-popular">
                    {(total + total * 0.2).toFixed(2)} EG
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/follow-order", {
                    state: { data: cart },
                  })
                }
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 xl:py-5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base xl:text-lg"
              >
                Place Order ({cart.length}{" "}
                {cart.length === 1 ? "item" : "items"})
              </button>
            </div>
          )}
        </div>

        {/* Mobile Cart Sidebar */}
        <div
          className={`xl:hidden fixed inset-y-0 right-0 z-50 w-80 bg-secondary text-white transform transition-transform duration-300 ease-in-out ${
            showCart ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Order Summary
              </h3>
              <div className="flex gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No items in order</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click on menu items to add them
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = item.uniqueId || item._id;
                  return (
                    <div
                      key={itemId}
                      className="bg-black text-white rounded-xl px-3 py-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {item.title}
                          </h4>

                          {/* Show base price and extras separately */}
                          <div className="text-xs mt-1 space-y-1">
                            <div className="text-gray-300">
                              Base: {item.price?.toFixed(2) || "0.00"} EG
                            </div>

                            {item.customizationPrice > 0 && (
                              <div className="text-yellow-400">
                                Extras: {item.customizationPrice?.toFixed(2)} EG
                              </div>
                            )}
                          </div>

                          {/* Show customizations with individual prices */}
                          {item.customizations && (
                            <div className="text-xs mt-1">
                              {item.customizations.extrasWithPrices &&
                                item.customizations.extrasWithPrices.length >
                                  0 && (
                                  <div>
                                    <span className="text-green-400 font-medium">
                                      Added:
                                    </span>
                                    <div className="ml-2 space-y-1">
                                      {item.customizations.extrasWithPrices.map(
                                        (extra, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between text-xs"
                                          >
                                            <span>• {extra.name}</span>
                                            <span className="text-yellow-400">
                                              {extra.price.toFixed(2)} EG
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              {item.customizations.removalsWithDetails &&
                                item.customizations.removalsWithDetails.length >
                                  0 && (
                                  <div className="mt-1">
                                    <span className="text-orange-400 font-medium">
                                      Remove:
                                    </span>{" "}
                                    {item.customizations.removalsWithDetails
                                      .map((removal) => removal.name)
                                      .join(", ")}
                                  </div>
                                )}
                              {item.customizations.specialInstructions && (
                                <div className="mt-1">
                                  <span className="text-blue-400 font-medium">
                                    Note:
                                  </span>{" "}
                                  {item.customizations.specialInstructions}
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-popular font-bold mt-1">
                            Total:
                            {(item.finalPrice || item.price)?.toFixed(2) ||
                              "0.00"}{" "}
                            EG
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(itemId);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(itemId, -1);
                            }}
                            className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-popular rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(itemId, 1);
                            }}
                            className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-popular rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold">Total:</span>
                  <span className="text-md font-bold text-popular">
                    {total.toFixed(2)} EG
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold">Vat:</span>
                  <span className="text-md font-bold text-popular">20%</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold">Total After Vat:</span>
                  <span className="text-md font-bold text-popular">
                    {(total + total * 0.2).toFixed(2)} EG
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowCart(false);
                    navigate("/follow-order", {
                      state: { data: cart },
                    });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Place Order ({cart.length} items)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cart Overlay */}
        {showCart && (
          <div
            className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCart(false)}
          />
        )}
      </div>

      {/* Customization Modal */}
      {showCustomization && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Customize {selectedProduct.title}
              </h3>
              <button
                onClick={closeCustomization}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Size Selection */}

              {/* Extras */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Add Extras</h4>
                <div className="space-y-2">
                  {customizationOptions.extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center text-gray-800 justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customizations.extras.includes(extra.id)}
                          onChange={(e) =>
                            handleCustomizationChange(
                              "extras",
                              extra.id,
                              e.target.checked
                            )
                          }
                          className="mr-3"
                        />
                        <span className="font-medium">{extra.name}</span>
                      </div>
                      <span className="text-popular font-bold">
                        {extra.price.toFixed(2)} EG
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Removals */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Remove Items
                </h4>
                <div className="space-y-2">
                  {customizationOptions.removals.map((removal) => (
                    <label
                      key={removal.id}
                      className="flex items-center text-gray-800 justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customizations.removals.includes(removal.id)}
                          onChange={(e) =>
                            handleCustomizationChange(
                              "removals",
                              removal.id,
                              e.target.checked
                            )
                          }
                          className="mr-3"
                        />
                        <span className="font-medium">{removal.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Special Instructions
                </h4>
                <textarea
                  value={customizations.specialInstructions}
                  onChange={(e) =>
                    handleCustomizationChange(
                      "specialInstructions",
                      e.target.value
                    )
                  }
                  placeholder="Any special requests or modifications..."
                  className="w-full p-3 border text-gray-800 rounded-lg resize-none h-20"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Base Price:</span>
                  <span>{selectedProduct.price?.toFixed(2) || "0.00"} EG</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Customizations:</span>
                  <span>{calculateCustomizationPrice().toFixed(2)} EG</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-popular">
                    {(
                      (selectedProduct.price || 0) +
                      calculateCustomizationPrice()
                    ).toFixed(2)}{" "}
                    EG
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={closeCustomization}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addToCartWithCustomizations}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
