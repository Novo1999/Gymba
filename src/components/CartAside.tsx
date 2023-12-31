import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CartItem } from '@/hooks/useHandleCart'

import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShoppingCart,
} from 'react-icons/ai'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { BsFillCartFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useTheme } from './ThemeProvider'
import { CartContext } from '@/App'
import { useContext } from 'react'

type CartAsideProps = {
  isDeleting: boolean
  isUpdating: boolean
  isFetching: number
  currentUpdating: string
  updateCartItemQuantity: (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => Promise<void>
  handleDeleteItem: (id: string) => Promise<void>
  userExist: string
}

const CartAside = ({
  isDeleting,
  isUpdating,
  isFetching,
  currentUpdating,
  updateCartItemQuantity,
  handleDeleteItem,
  userExist,
}: CartAsideProps) => {
  const { theme } = useTheme()
  const { tempCartData } = useContext(CartContext)
  return (
    <aside>
      <Sheet>
        <SheetTrigger
          className={`text-3xl flex ${
            theme === 'dark' ? 'text-white' : 'text-black'
          } justify-center relative`}
        >
          <AiOutlineShoppingCart />
          <div
            className={` bg-red-500 rounded-full p-2 h-2 top-0 text-xs left-4 ${
              tempCartData?.length > 0 ? 'absolute' : 'hidden'
            } flex justify-center items-center text-white w-fit`}
          >
            {tempCartData?.length}
          </div>
        </SheetTrigger>
        <SheetContent className='overflow-y-scroll w-screen'>
          <SheetHeader>
            <SheetTitle>Cart</SheetTitle>
            <Table>
              {/* Deleting Spinner */}
              {isDeleting ? (
                <TableBody>
                  <TableRow>
                    <td className='loading loading-ring loading-lg top-0 right-0 left-0 bottom-0 m-auto absolute'></td>
                  </TableRow>
                </TableBody>
              ) : tempCartData?.length > 0 ? (
                // Total Price
                <TableCaption>
                  Total: $
                  {tempCartData?.reduce((acc: number, cur: CartItem) => {
                    let total
                    if (userExist) {
                      total = acc + cur.price!
                    } else total = acc + cur.price! * cur.quantity!
                    return Number(total.toFixed(2))
                  }, 0)}
                </TableCaption>
              ) : (
                <TableCaption className='flex items-center flex-col gap-4 '>
                  <span
                    className='flex justify-center
                      items-center gap-1'
                  >
                    Your <BsFillCartFill /> Cart is Empty
                  </span>
                  <>
                    <Link
                      className='w-fit hover:bg-slate-400 hover:text-white bg-slate-200 p-3 rounded-xl duration-300'
                      to='/all-products'
                    >
                      <SheetTrigger>
                        <span className='p-3'>Shop Now</span>
                      </SheetTrigger>
                    </Link>
                  </>
                </TableCaption>
              )}
              {tempCartData?.length > 0 && (
                // Header
                <TableHeader>
                  <TableRow className='flex justify-between px-2'>
                    <TableHead className='w-fit relative left-4 sm:left-10'>
                      Product
                    </TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
              )}

              <TableBody>
                {tempCartData?.map((item: CartItem) => {
                  const { name, quantity, link, price } = item
                  const productId = item.productId || item._id

                  return (
                    quantity! > 0 && (
                      <TableRow
                        key={productId}
                        className='flex justify-between items-center border-0'
                      >
                        <TableCell className='flex flex-col gap-2 items-center'>
                          {/* item image */}
                          <img
                            className='w-14 m-auto'
                            src={link}
                            alt='item image'
                          />
                          <span className='text-xs w-20 min-[425px]:text-sm sm:text-base text-center sm:w-36'>
                            {name}
                          </span>
                          {/* item quantity buttons */}
                          <div className='flex gap-2'>
                            {/* minus */}
                            <button
                              disabled={
                                isUpdating ||
                                (isFetching === 1 &&
                                  currentUpdating === productId)
                              }
                              onClick={(e) => {
                                updateCartItemQuantity(e, productId!)
                              }}
                              value='minus'
                              className={`btn-xs btn-warning rounded-full hover:bg-yellow-400 duration-300 ${
                                isUpdating && currentUpdating === productId
                                  ? 'opacity-50'
                                  : 'opacity-100'
                              }`}
                            >
                              <AiOutlineMinus />
                            </button>
                            <button
                              value='minus'
                              className={`btn-xs rounded-full cursor-context-menu bg-black ${
                                quantity!.toString().length > 2 ? 'w-7' : 'w-6'
                              } text-white font-semibold flex justify-center items-center`}
                            >
                              {/* quantity */}
                              {isUpdating && currentUpdating === productId ? (
                                <span className='loading loading-spinner text-white w-3 h-3'></span>
                              ) : (
                                quantity
                              )}
                            </button>
                            {/* plus */}
                            <button
                              disabled={
                                isUpdating ||
                                (isFetching === 1 &&
                                  currentUpdating === productId)
                              }
                              onClick={(e) => {
                                updateCartItemQuantity(e, productId!)
                              }}
                              value='plus'
                              className={`btn-xs ${
                                isUpdating && currentUpdating === productId
                                  ? 'opacity-50'
                                  : 'opacity-100'
                              } rounded-full btn-warning hover:bg-yellow-400 duration-300`}
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                        </TableCell>
                        {/* price and delete button */}
                        <TableCell className='flex justify-between flex-col gap-2 items-center'>
                          <span>
                            $
                            {userExist
                              ? price?.toFixed(2)
                              : (price! * quantity!)?.toFixed(2)}
                          </span>
                          <div
                            className='tooltip tooltip-warning '
                            data-tip='Delete'
                          >
                            <Button
                              className='relative top-2'
                              onClick={() => handleDeleteItem(productId!)}
                              variant='outline'
                              size='icon'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                })}
              </TableBody>
            </Table>
            {tempCartData?.length > 0 && (
              <Link
                to='/payment'
                className='btn btn-success w-fit m-auto'
                type='submit'
              >
                Checkout
              </Link>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </aside>
  )
}
export default CartAside
