import { CartContext, CartStatus } from '@/App'
import { showCartToast } from '../components/CartToast'
import { useContext } from 'react'
import { useGetCart } from './useGetCart'
import { UserCart } from '@/components/Cart'
import customFetch from '@/utils/customFetch'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAllProducts } from './useGetAllProducts'

export type CartItem = {
  id?: string | undefined
  productId?: string
  quantity?: number
  price?: number
  name?: string
  _id?: string
  link?: string
  length?: number
}

export const useHandleCart = () => {
  const { cartStatus, setCartStatus } = useContext(CartContext)
  const { data } = useGetAllProducts('a-z', 0, 0)
  const { data: userCart } = useGetCart()
  const onlineCart = (userCart as UserCart)?.data?.cart[0]
    ?.products as CartItem[]
  const queryClient = useQueryClient()

  const handleIncreaseQuantity = (id: string) => {
    setCartStatus((currentItems: CartStatus) => {
      if (!currentItems.find((item) => item.id === id)) {
        return [...currentItems, { id, quantity: 1 }]
      } else {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity! + 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  const handleDecreaseQuantity = (id: string) => {
    setCartStatus((currentItems) => {
      const currentItemQuantity = currentItems.find(
        (item) => item.id === id
      )?.quantity
      // fallback value
      if (currentItemQuantity! <= 1) {
        return currentItems.filter((item) => item.id !== id)
      } else {
        return currentItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity! >= 1 ? item.quantity! - 1 : 0,
            }
          } else {
            return item
          }
        })
      }
    })
  }

  // session storage cart logic for temporary cart if user is not logged in
  const handleAddToCart = async (id: string) => {
    if (!(userCart as UserCart)?.data?.currentUser?.email) {
      // get the cart from session storage or an empty array if there is none
      const anonCart = JSON.parse(sessionStorage.getItem('anonCart')!) || []
      // check if item exist
      const existingItem = anonCart.find((item: CartItem) => item.id === id)

      // if item exists, update its quantity only
      cartStatus.filter((CartItem: CartItem) => {
        if (CartItem.id === id && existingItem) {
          existingItem.quantity += CartItem.quantity
        }
        // if item does not exist but id matches, add it to the cart
        if (CartItem.id === id && !existingItem) {
          anonCart.push(CartItem)
        }
        // set cart in session storage
      })

      sessionStorage.setItem('anonCart', JSON.stringify(anonCart))

      // resetting the item state
      setCartStatus((currentItems: CartStatus) => {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: 0 }
          } else {
            return item
          }
        })
      })
      showCartToast(id)
    } else {
      // when user logs in use the online cart
      const existingItem = onlineCart?.find(
        (item: CartItem) => item.productId === id
      )

      // if item exists
      if (existingItem) {
        const { productId } = existingItem
        // get price of existing item
        const price = data?.data.find(
          (item: CartItem) => item._id === productId
        ).price
        // get quantity of items added
        const quantity = cartStatus.find(
          (item) => item.id === productId
        )?.quantity
        await customFetch.post('/cart', {
          productId,
          price,
          quantity,
        })
        // if item does not exist
      } else {
        const newItem = data?.data.find((item: CartItem) => item._id === id)
        const { _id: productId, price, link, name } = newItem
        const quantity = cartStatus.find(
          (item) => item.id === productId
        )?.quantity
        await customFetch.post('/cart', {
          name,
          productId,
          price: price * quantity!,
          quantity,
          link,
        })
      }
      setCartStatus((currentItems: CartStatus) => {
        return currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: 0 }
          } else {
            return item
          }
        })
      })
      showCartToast(id)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  }
  return { handleIncreaseQuantity, handleDecreaseQuantity, handleAddToCart }
}
