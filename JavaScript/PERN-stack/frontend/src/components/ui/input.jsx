import { forwardRef } from "react"


export const Input = forwardRef((props, ref) => {
  return (
    <input ref={ref} type="text" className='border p-2 rounded-md bg-gray-800 text-white w-full mb-4' 
    {...props} />
  )
})

export default Input    