export default function Error() {
    return (
        <div className="absolute inset-0 bg-[#001219]/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-red-500 text-xl">Load error, please try again later</div>
            </div>
        </div>
    )
}