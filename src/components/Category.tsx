import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Product } from '@/pages/AllProducts'
import customFetch from '@/utils/customFetch'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Spinner } from '.'

const Category = () => {
  // getting the categories for the select
  const { data: allCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await customFetch.get('products/categories'),
  })
  const [category, setCategory] = useState('Cardio+Equipment')

  // getting the products by category
  const { data: productsByCategory, isLoading } = useQuery({
    queryKey: ['product-by-category', category],
    queryFn: async () =>
      await customFetch.get(`products/product?category=${category}`),
  })

  const handleCategory = (value: string) => {
    setCategory(value)
  }

  return (
    <section className='flex flex-col mx-2 sm:mx-5 h-fit sm:h-[50rem] lg:mx-40'>
      <div className='flex justify-between mx-4 xl:mx-20 text-sm items-center mt-6'>
        <h2 className='font-semibold sm:text-xl'>Shop by category</h2>
        <Select onValueChange={(value) => handleCategory(value)}>
          <SelectTrigger className='sm:w-[180px] w-fit'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            {allCategories?.data?.map((category: string) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 m-4 mt-10 xl:mx-20 gap-4'>
          {productsByCategory?.data.slice(0, 4).map((product: Product) => {
            const { _id: id, brand, name, price, link } = product
            return (
              <Link
                to={`/products/product/${id}`}
                className='shadow-md rounded-lg p-4 flex flex-col items-center gap-2 border-2 border-slate-400 relative group'
                key={id}
              >
                <div className='absolute bottom-0 opacity-0 transition-opacity group-hover:opacity-100 bg-slate-400 py-2 text-white w-full text-center'>
                  View
                </div>
                <img
                  className='h-36 min-[375px]:h-48 m-auto'
                  src={link}
                  alt='product image'
                />
                <p className='font-semibold'>{name}</p>
                <p className='text-xs'>{brand}</p>
                <p className='font-bold'>${price}</p>
              </Link>
            )
          })}
        </div>
      )}
      {productsByCategory?.data.length > 4 && (
        <Link
          className='ml-4 xl:ml-20'
          to={`products/product?category=${category}`}
        >
          <Button variant='outline'>See More</Button>
        </Link>
      )}
    </section>
  )
}
export default Category
