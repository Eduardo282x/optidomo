import { Leaf } from "lucide-react"

export const Loading = () => {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className="w-14 h-14 border-[4px] border-solid border-gray-100 rounded-full border-t-green-500 animate-spin">
            </div>
            <div className="bg-green-500 rounded-full absolute p-2 -z-20">
                <Leaf className="w-8 h-8 text-white" />
            </div>
        </div>
    )
}
