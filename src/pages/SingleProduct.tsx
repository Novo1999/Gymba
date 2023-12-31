import { Product, Spinner } from '@/components'
import { useGetSingleProduct } from '@/hooks/useGetSingleProduct'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { BsArrowRightCircleFill } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { ProductInterface } from './AllProducts'
import { CartItem, useHandleCart } from '@/hooks/useHandleCart'
import { useContext } from 'react'
import { CartContext } from '@/App'
import { useTheme } from '@/components/ThemeProvider'

const SingleProduct = () => {
  const { data, isLoading } = useGetSingleProduct()
  const { handleIncreaseQuantity, handleDecreaseQuantity, handleAddToCart } =
    useHandleCart()
  const { cartStatus } = useContext(CartContext)
  const { theme } = useTheme()

  const { id }: { id?: string } = useParams()
  const product = data?.data.product
  const relatedProducts = data?.data?.relatedProducts

  if (!product) {
    return isLoading ? (
      <div className='min-h-screen bg-white'>
        <Spinner />
      </div>
    ) : (
      <div className='flex justify-center items-center'>
        <p>Nothingness...</p>
      </div>
    )
  }

  const { name, brand, description, price, category, link } = product
  return isLoading ? (
    <Spinner />
  ) : (
    <section className='py-6 h-full gap-2 px-2 font-poppins xl:mx-40 2xl:mx-72 min-h-screen'>
      <div
        className={`border-2 border-slate-400 rounded-lg mx-4 p-4 ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        }  flex flex-col sm:flex-row  justify-between xl:justify-center xl:gap-40 lg:h-[32rem] xl:h-[36rem] items-center `}
      >
        {/* LEFT DIV */}
        <div className='place-items-start flex flex-col lg:items-center lg:gap-10 sm:w-60 lg:w-96'>
          <div className=''>
            <img
              className='w-fit h-fit lg:h-80 sm:h-72 xl:h-96 object-contain'
              src={link}
              alt='product image'
            />
          </div>
          <div className='m-auto w-full'>
            <p className='text-center text-xl mt-4 sm:mt-0'>{name}</p>
            <div className='flex m-auto gap-2 items-center my-4'>
              <div className='grid flex-grow card rounded-box place-items-center'>
                Sold By
              </div>
              <span className='text-2xl'>
                <BsArrowRightCircleFill />
              </span>
              <div className='grid flex-grow card rounded-box place-items-center text-rose-500'>
                {brand}
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT DIV */}
        <div className='space-y-6 sm:flex flex-col sm:w-[24rem] items-center sm:items-start lg:mb-[75px]'>
          <p className='text-center font-semibold text-xl sm:text-2xl lg:text-3xl'>
            Price: ${price}
          </p>
          <p className='text-sm lg:text-lg text-center sm:text-left mb-40'>
            {description}
          </p>

          <Link
            className='w-fit flex m-auto sm:m-0'
            to={`/products/product?category=${category}`}
          >
            <div className='badge badge-accent text-xs lg:text-base lg:p-3'>
              {category}
            </div>
          </Link>
          <div className='flex justify-center gap-4 items-center'>
            <button
              onClick={() => handleDecreaseQuantity(id!)}
              className='btn-sm rounded-lg btn-warning'
            >
              <AiOutlineMinus />
            </button>
            <kbd className='kbd text-white h-full w-fit'>
              {cartStatus.find((item: CartItem) => item.id === id)?.quantity ||
                0}
            </kbd>
            <button
              onClick={() => handleIncreaseQuantity(id!)}
              className='btn-sm rounded-lg btn-warning'
            >
              <AiOutlinePlus />
            </button>
          </div>
          <button
            onClick={() => handleAddToCart(id!)}
            className={`btn-md flex ${
              cartStatus.find((item: { id: string }) => item.id === id)
                ?.quantity
                ? 'visible'
                : 'invisible'
            } justify-center items-center rounded-lg w-fit btn-active btn-accent mt-4 p-4 m-auto sm:m-0 hover:bg-cyan-700 transition-colors duration-300`}
          >
            Add To Cart
          </button>
        </div>
      </div>
      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <p className='text-center mt-10 mb-10'>Related Products</p>
      )}
      <div className='mx-8 pb-10 gap-4 grid place-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {typeof relatedProducts !== 'string' ? (
          relatedProducts.map((product: ProductInterface) => {
            return <Product key={product._id} product={product} />
          })
        ) : (
          <p>{relatedProducts}</p>
        )}
      </div>
    </section>
  )
}
export default SingleProduct
