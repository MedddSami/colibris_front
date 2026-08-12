'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Cart, RefillCart } from '@/types/api'
import { cartService } from '@/services/CartService'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { orderService } from '@/services/orderService'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import { userService } from '@/services/userService'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [refillCart, setRefillCart] = useState<RefillCart | null>(null);

  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const router = useRouter();

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [usePoints, setUsePoints] = useState(false);

  const { toast } = useToast();

  const { user, isAuthenticated, isInitialized } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [deliveryOption, setDeliveryOption] = useState<
    "custom" | "collection"
  >("collection");

  const [deliveryDate, setDeliveryDate] = useState("");

  const [nextCollectionDate, setNextCollectionDate] =
    useState<string | null>(null);


  const [paymentMethod, setPaymentMethod] = useState<
    "money" | "points" | "hybrid"
  >("money");


  const [userPoints, setUserPoints] = useState(0);

  const [pointsToUse, setPointsToUse] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  type UnifiedCartItem = {
    id: string;
    type: "article" | "refill";

    productId: string;
    name: string;
    description: string;
    photo: string;

    unitPrice: number;
    quantity: number;
    totalPrice: number;

    volume?: "1L" | "2L" | "5L";
  };

  const [cartItems, setCartItems] = useState<UnifiedCartItem[]>([]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const shipping =
    deliveryOption === "custom"
      ? 7
      : 0;

  const orderTotal = subtotal + shipping;

  // Maximum discount allowed cannot exceed order total
  const maxPointsDiscount = Math.min(
    userPoints * 0.1,
    orderTotal
  );

  // Convert discount limit back to points
  const maxPointsUsable = maxPointsDiscount / 0.1;

  const pointsDiscount = Math.min(
    pointsToUse * 0.1,
    maxPointsDiscount
  );

  const total = orderTotal - pointsDiscount;

  useEffect(() => {
    if (pointsToUse > maxPointsUsable) {
      setPointsToUse(maxPointsUsable);
    }
  }, [maxPointsUsable]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);

      const [normalCart, refill] = await Promise.all([
        cartService.getCart(),
        cartService.getRefillCart(),
      ]);

      setCart(normalCart);
      setRefillCart(refill);

      console.log(normalCart, refill)

      const normalItems: UnifiedCartItem[] =
        normalCart.items.map((item) => ({
          id: item._id,
          type: "article",

          productId: item.article._id,
          name: item.article.nom,
          description: item.article.description,
          photo: item.article.photo,

          unitPrice: item.article.prix,
          quantity: item.quantity,
          totalPrice: item.article.prix * item.quantity,
        }));

      const refillItems: UnifiedCartItem[] =
        refill.items.map((item) => ({
          id: item._id,
          type: "refill",

          productId: item.article._id,
          name: item.article.nom,
          description: item.article.description,
          photo: item.article.photo,

          unitPrice: item.article.prix,
          quantity: item.quantity,
          totalPrice: item.price,

          volume: item.volume,
        }));

      setCartItems([
        ...normalItems,
        ...refillItems,
      ]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckoutData = async () => {
    if (!isAuthenticated) return;
    try {
      const [
        points,
        collection
      ] = await Promise.all([
        orderService.getUserPoints(),
        userService.getNextBookedCollection(),
      ]);

      setUserPoints(points.points);
      console.log(collection.reservation.collection.date, "collection");

      setNextCollectionDate(
        collection.reservation.collection.date
      );

    } catch (error) {

      console.error(
        "Checkout data error",
        error
      );

    }
  };

  useEffect(() => {
    fetchCart();
    fetchCheckoutData();
  }, []);

  const continueShoppingHref =
    cartItems.some((item) => item.type === "article")
      ? "/shop"
      : "/refill-shop";

  const refillItems = refillCart?.items ?? [];
  const normalItems = cart?.items ?? [];

  const totalRefillLiters = refillItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalContainers = refillItems.length;

  const totalCO2Saved =
    refillItems.reduce(
      (sum, item) =>
        sum + item.article.CO2_refill * item.quantity,
      0
    ) +
    normalItems.reduce(
      (sum, item) =>
        sum + item.article.CO2 * item.quantity,
      0
    );

  const totalRewardPoints =
    refillItems.reduce(
      (sum, item) =>
        sum + item.article.points * item.quantity,
      0
    ) +
    normalItems.reduce(
      (sum, item) =>
        sum + item.article.points * item.quantity,
      0
    );

  const carbonProgress = Math.min(totalCO2Saved, 100);
  const refillProgress = Math.min(totalRefillLiters * 5, 100);

  const getVolumeNumber = (volume: "1L" | "2L" | "5L") =>
    Number(volume.replace("L", ""));


  const handleUpdateQuantity = async (
    item: UnifiedCartItem,
    increment: boolean
  ) => {
    try {
      if (item.type === "article") {
        const newQuantity = increment
          ? item.quantity + 1
          : item.quantity - 1;

        if (newQuantity < 1) return;

        await cartService.updateCart({
          articleId: item.productId,
          quantity: newQuantity,
        });
      } else {
        const volumeSize = getVolumeNumber(item.volume!);

        const newQuantity = increment
          ? item.quantity + volumeSize
          : item.quantity - volumeSize;

        if (newQuantity < volumeSize) {
          //await handleRemove(item);
          return;
        }

        await cartService.updateRefillCart({
          articleId: item.productId,
          quantity: newQuantity,
          volume: item.volume!,
          price: item.unitPrice * newQuantity,
        });
      }

      await fetchCart();

      toast({
        title: "Cart updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ??
          "Could not update the cart.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (
    item: UnifiedCartItem
  ) => {
    try {
      if (item.type === "article") {
        await cartService.removeFromCart(
          item.productId
        );
      } else {
        await cartService.removeFromRefillCart(
          item.productId
        );
      }

      await fetchCart();

      toast({
        title: "Removed",
        description: `${item.name} removed from your cart.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ??
          "Could not remove this item.",
        variant: "destructive",
      });
    }
  };

  const formatDeliveryDate = () => {

    if (deliveryOption === "custom") {

      if (!deliveryDate)
        return null;
      const date = new Date(deliveryDate);

      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")
        }/${date.getFullYear()
        }`;

    }

    if (deliveryOption === "collection" && nextCollectionDate) {
      // Already in DD/MM/YYYY format
      return nextCollectionDate;
    }

    return null;

  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);

      const formattedDeliveryDate = formatDeliveryDate();

      if (!formattedDeliveryDate) {
        toast({
          title: "Delivery date required",
          description: "Please choose a delivery option.",
          variant: "destructive",
        });
        return;
      }

      if (paymentMethod === "points" && userPoints < totalRewardPoints) {
        toast({
          title: "Insufficient points",
          description: "You don't have enough reward points.",
          variant: "destructive",
        });
        return;
      }

      if (paymentMethod === "hybrid" && pointsToUse > userPoints) {
        toast({
          title: "Invalid points amount",
          description: "The selected points exceed your balance.",
          variant: "destructive",
        });
        return;
      }

      if (cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          variant: "destructive",
        });
        return;
      }

      // Single request carrying the whole (possibly mixed) cart. The
      // backend is responsible for splitting this into a shop order and/or
      // a refill order, and for making sure the delivery fee and the points
      // spent are each counted exactly once for the whole checkout — not
      // once per item type. Sending two separate requests (as before) is
      // what caused the delivery fee and pointsToUse to be double-applied
      // for mixed carts.
      const items = cartItems.map((item) => ({
        articleId: item.productId,
        itemType: item.type === "refill" ? "refill" : "shop",
        quantity: item.quantity,
        ...(item.type === "refill" ? { volume: item.volume } : {}),
      }));

      const payload = {
        items,
        deliveryOption,
        deliveryDate: formattedDeliveryDate,
        usePoints: paymentMethod === "points",
        pointsToUse: paymentMethod === "hybrid" ? pointsToUse : 0,
      };

      const created = await orderService.createOrder(payload);
      // created: { orderGroup, shopOrder: Order | null, refillOrder: Order | null }

      // Clear whichever carts actually had items — both are safe to call
      // even if empty, but this avoids an unnecessary request when the cart
      // was single-type.
      const hasShopItems = cartItems.some((item) => item.type !== "refill");
      const hasRefillItems = cartItems.some((item) => item.type === "refill");

      if (hasShopItems) await cartService.clearCart();
      if (hasRefillItems) await cartService.clearRefillCart();

      // Refresh local state
      await fetchCart();

      const hasShop = !!created.shopOrder;
      const hasRefill = !!created.refillOrder;

      toast({
        title: "Order placed",
        description:
          hasShop && hasRefill
            ? "Your shop and refill orders were created successfully."
            : hasShop
              ? "Your shop order was created successfully."
              : "Your refill order was created successfully.",
      });

      router.push("/dashboard/orders");
    } catch (error: any) {
      console.error("Checkout error:", error);

      toast({
        title: "Checkout failed",
        description:
          error?.response?.data?.message ?? "Could not create your order.",
        variant: "destructive",
      });
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-8 pt-32 pb-20">

        {/* Hero */}
        <header className="mb-16">
          <h1 className="text-[3.5rem] font-bold leading-tight tracking-[-0.02em] text-on-surface">
            Your Curated Selection
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
            Refining the balance between aesthetic excellence and ecological responsibility.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Side */}
          <section className="lg:col-span-8 space-y-8">


            {!isAuthenticated ? (
              <div className="rounded-xl bg-surface-container-low p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-4">
                  lock
                </span>

                <h3 className="text-2xl font-bold mb-2">
                  Sign in to view your cart
                </h3>

                <p className="text-on-surface-variant mb-8">
                  Log in to access your cart, manage your orders, and continue shopping.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/auth/signin"
                    className="inline-flex justify-center px-8 py-4 rounded-full bg-primary text-white font-bold"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/shop"
                    className="inline-flex justify-center px-8 py-4 rounded-full border border-primary text-primary font-bold"
                  >
                    Discover Shop
                  </Link>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="rounded-xl bg-surface-container-low p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-4">
                  shopping_bag
                </span>

                <h3 className="text-2xl font-bold mb-2">
                  Your cart is empty
                </h3>

                <p className="text-on-surface-variant mb-8">
                  Start exploring our sustainable collection.
                </p>

                <Link
                  href="/shop"
                  className="inline-flex px-8 py-4 rounded-full bg-primary text-white font-bold"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (cartItems.map((item) => {
              const containerCount =
                item.type === "refill"
                  ? item.quantity / getVolumeNumber(item.volume!)
                  : item.quantity;

              return (
                <Card
                  key={item.id}
                  className="group relative flex flex-col md:flex-row gap-8 p-8 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container-high/50"
                >

                  {/* Product Image */}
                  <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0">

                    <img
                      src={`${API_URL}${item.photo}`}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                    />

                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-between flex-grow">

                    <div>

                      <div className="flex justify-between items-start">

                        <div>
                          <h3 className="text-xl font-bold text-on-surface">
                            {item.name}
                          </h3>
                          {item.type === "refill" && (
                            <span className="text-xs text-on-surface-variant">
                              ({item.volume} container)
                            </span>
                          )}

                          <p className="text-sm text-on-surface-variant mt-2">
                            {(item.type == "refill")
                              ? 'Refillable • Sustainable Formula'
                              : 'Premium Collection'}
                          </p>
                        </div>

                        <span className="text-xl font-bold text-primary">
                          {(item.unitPrice * item.quantity).toFixed(2)} TND
                        </span>

                      </div>

                      {/* Quantity */}
                      <div className="mt-6 flex items-center gap-4">

                        <div className="flex items-center bg-surface-container-lowest px-4 py-2 rounded-full border-none">

                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, false)
                            }
                            className="text-primary hover:scale-110 transition-transform"
                          >
                            <span className="material-symbols-outlined text-sm">
                              remove
                            </span>
                          </button>

                          <span className="mx-4 font-bold text-on-surface">
                            <span className="mx-4 font-bold text-on-surface">
                              {item.type === "refill"
                                ? `${containerCount} × ${item.volume} container`
                                : item.quantity}
                            </span>
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, true)
                            }
                            className="text-primary hover:scale-110 transition-transform"
                          >
                            <span className="material-symbols-outlined text-sm">
                              add
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-6 items-center">

                      <button
                        onClick={() => handleRemove(item)}
                        className="text-sm font-medium text-error hover:underline underline-offset-4 transition-all"
                      >
                        Remove
                      </button>

                    </div>
                  </div>
                </Card>
              )
            }))}

            {/* Refill Program */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">

              {/* Left Card */}
              <div className="p-8 rounded-xl bg-primary text-white overflow-hidden relative group">

                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

                <h4 className="text-2xl font-bold mb-4">
                  Circular Refill Program
                </h4>

                <p className="text-on-primary/80 mb-8 leading-relaxed">
                  Send back your empty vessels for a zero-waste recharge and receive 20% credit toward your next curation.
                </p>

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">

                    <span className="material-symbols-outlined">
                      recycling
                    </span>

                  </div>

                  <div>
                    <p className="font-bold">Active Status</p>

                    <p className="text-sm opacity-70">
                      {totalContainers} refill container
                      {totalContainers !== 1 && "s"} in your cart
                    </p>
                  </div>

                </div>

                <Link
                  href="/dashboard/bookings"
                  className="mt-10 w-full flex items-center justify-center bg-white text-primary font-bold py-4 rounded-full active:scale-95 transition-all"
                >
                  Request Collection
                </Link>

              </div>

              {/* Right Card */}
              <div className="p-8 rounded-xl bg-surface-container-high flex flex-col justify-between">

                <div>

                  <h4 className="text-2xl font-bold text-on-surface mb-2">
                    Impact Summary
                  </h4>

                  <p className="text-on-surface-variant text-sm mb-8">
                    Your contribution to the biophilic ecosystem this month.
                  </p>

                  <div className="space-y-6">

                    <div>
                      <div className="flex justify-between items-center mb-2">

                        <span className="text-sm font-medium text-on-surface-variant">
                          Carbon Offset
                        </span>

                        <span className="text-sm font-bold text-primary">
                          {totalCO2Saved.toFixed(1)} kg CO₂e
                        </span>

                      </div>

                      <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{
                            width: `${carbonProgress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">

                        <span className="text-sm font-medium text-on-surface-variant">
                          Waste Diverted
                        </span>

                        <span className="text-sm font-bold text-primary">
                          {totalRefillLiters}L Refilled
                        </span>

                      </div>

                      <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary-container h-full rounded-full transition-all"
                          style={{
                            width: `${refillProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 sticky top-32">

            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0_12px_32px_rgba(20,29,32,0.06)]">

              <h2 className="text-2xl font-bold mb-8">
                Summary
              </h2>

              <div className="space-y-6">

                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {subtotal.toFixed(2)} TND
                  </span>
                </div>

                <div className="mt-8 space-y-6">

                  <h3 className="text-lg font-bold">
                    Delivery Options
                  </h3>

                  {/* Delivery option */}

                  <div className="space-y-3">

                    {/* Collection */}
                    <label className="flex items-center gap-3 cursor-pointer">

                      <input
                        type="radio"
                        checked={deliveryOption === "collection"}
                        onChange={() =>
                          setDeliveryOption("collection")
                        }
                      />

                      <div>
                        <span className="font-medium">
                          Your next Collection Point (Free)
                        </span>

                        <p className="text-sm text-on-surface-variant">
                          {nextCollectionDate
                            ? `Available on ${(
                              nextCollectionDate
                            )}`
                            : "No booked collection available"}
                        </p>

                      </div>

                    </label>

                    {/* Custom delivery */}
                    <label className="flex items-center gap-3 cursor-pointer">

                      <input
                        type="radio"
                        checked={deliveryOption === "custom"}
                        onChange={() =>
                          setDeliveryOption("custom")
                        }
                      />


                      <div>

                        <span className="font-medium">
                          Custom Delivery (+7 TND)
                        </span>

                        <p className="text-sm text-on-surface-variant">
                          Choose your preferred delivery date
                        </p>

                      </div>
                    </label>
                  </div>

                  {/* Custom delivery date */}
                  {deliveryOption === "custom" && (
                    <div>

                      <label className="block text-sm font-medium mb-2">
                        Delivery Date
                      </label>

                      <input
                        type="date"
                        value={deliveryDate}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(e) =>
                          setDeliveryDate(
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-lg
                          bg-surface-container-low
                          px-4 py-3
                        "
                      />
                    </div>
                  )}

                  {/* Points */}
                  <div className="space-y-3">

                    <h3 className="font-bold">
                      Pay with Points
                    </h3>

                    <div className="p-4 rounded-xl bg-surface-container-low">

                      {/* Header */}
                      <div className="flex justify-between items-center mb-3">

                        <div>
                          <span className="text-sm text-on-surface-variant">
                            Available
                          </span>

                        </div>

                        <span className="font-bold text-primary">
                          {userPoints} pts
                        </span>

                      </div>


                      {/* Input + slider */}
                      <div className="flex items-center gap-3">

                        <input
                          type="number"
                          min={0}
                          max={maxPointsUsable}
                          value={pointsToUse}
                          onChange={(e) => {

                            let value = Number(e.target.value);

                            if (value > maxPointsUsable) {
                              value = maxPointsUsable;
                            }

                            if (value < 0 || Number.isNaN(value)) {
                              value = 0;
                            }

                            setPointsToUse(value);
                            setPaymentMethod(
                              value <= 0
                                ? "money"
                                : value >= maxPointsUsable
                                  ? "points"
                                  : "hybrid"
                            );

                          }}
                          className="
                            w-24
                            rounded-lg
                            bg-surface-container-lowest
                            border
                            border-outline-variant/20
                            px-3
                            py-2
                            font-bold
                            text-center
                            outline-none
                            focus:ring-2
                            focus:ring-primary
                          "
                        />

                        <input
                          type="range"
                          min={0}
                          max={maxPointsUsable}
                          value={pointsToUse}
                          onChange={(e) => {

                            const value = Number(e.target.value);

                            setPointsToUse(value);
                            setPaymentMethod(
                              value <= 0
                                ? "money"
                                : value >= maxPointsUsable
                                  ? "points"
                                  : "hybrid"
                            );

                          }}
                          className="
                            flex-1
                            accent-primary
                            cursor-pointer
                          "
                        />

                      </div>

                      {/* Summary */}
                      <div
                        className="
                          flex
                          justify-between
                          items-center
                          mt-3
                          pt-3
                          border-t
                          border-outline-variant/10
                          text-sm
                        "
                      >
                        <span className="text-on-surface-variant">
                          Using {pointsToUse} pts
                        </span>

                        <span className="font-bold text-primary">
                          -{pointsDiscount.toFixed(2)} TND
                        </span>

                      </div>

                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-on-surface-variant">
                  <span>Reward Points</span>

                  <span className="font-medium text-primary">
                    +{totalRewardPoints} pts
                  </span>
                </div>

                <div className="pt-6 border-t border-surface-container-high">

                  <div className="space-y-4">

                    {pointsToUse > 0 && (
                      <div className="flex justify-between items-center text-on-surface-variant">

                        <span>
                          Points discount
                        </span>

                        <span className="font-medium text-primary">
                          -{(pointsToUse * 0.1).toFixed(2)} TND
                        </span>

                      </div>
                    )}


                    <div className="flex justify-between items-end">

                      <span className="text-xl font-bold">
                        Total
                      </span>

                      <div className="text-right">

                        <span className="block text-2xl font-bold text-on-surface">

                          {Math.max(
                            0,
                            total
                          ).toFixed(2)} TND

                        </span>

                        <span className="text-xs text-on-surface-variant">
                          Including taxes and duties
                        </span>

                      </div>

                    </div>


                    {pointsToUse > 0 && (
                      <div className="flex justify-between text-sm text-on-surface-variant">

                        <span>
                          Points used
                        </span>

                        <span className="font-medium">
                          {pointsToUse} pts
                        </span>

                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-10 space-y-4">

                <button
                  onClick={handleCheckout}
                  disabled={!isAuthenticated || checkingOut}
                  className="w-full bg-primary text-white font-bold py-5 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkingOut
                    ? "Processing..."
                    : !isAuthenticated
                      ? "Sign in first"
                      : "Proceed to Secure Checkout"}
                </button>

                <Link
                  href={continueShoppingHref}
                  className="w-full flex items-center justify-center gap-3 bg-surface text-secondary border border-outline-variant/20 font-bold py-5 rounded-full hover:bg-surface-container-low active:scale-[0.98] transition-all"
                >
                  Continue Shopping
                </Link>

              </div>

              {/* Note */}
              <div className="mt-8 p-6 bg-surface-container-low rounded-lg text-center">

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Every purchase at Colibris supports our commitment for a better environement.
                  Your order will be shipped in 100% plastic-free, compostable packaging.
                </p>

              </div>
            </div>

            {/* Bottom Labels */}
            <div className="mt-8 px-6">

              <div className="flex gap-4 items-center mb-4">

                <span className="material-symbols-outlined text-primary">
                  verified_user
                </span>
                <span className="text-sm font-semibold">
                  Curated Quality Guarantee
                </span>

              </div>

              <div className="flex gap-4 items-center">

                <span className="material-symbols-outlined text-primary">
                  eco
                </span>

                <span className="text-sm font-semibold">
                  Climate Neutral Fulfillment
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}