import { CarRecord } from '../../types/car'
import { NavigateFunction } from 'react-router-dom'
import { formatDate } from '../../utils/util'
interface DataTableProps {
    records: CarRecord[]
    isLoggedIn: boolean
    navigate: NavigateFunction
}

function DataTable({ records, isLoggedIn, navigate }: DataTableProps) {
    return (
        <div className="bg-gray-100 rounded-lg overflow-x-auto text-gray-900">
            <div className="min-w-[1000px]">
                <table className="table-auto w-full text-left">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="p-2">Make</th>
                            <th className="p-2">Model</th>
                            <th className="p-2">Year</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Odometer (km)</th>
                            <th className="p-2">Condition</th>
                            <th className="p-2">Location</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Salvage</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr
                                key={index}
                                className={`
                    border-b hover:bg-gray-50 transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  `}
                            >
                                <td className="p-5">{record.make}</td>
                                <td className="p-5">{record.model}</td>
                                <td className="p-5">{record.year}</td>
                                <td className="p-5">{record.description}</td>
                                <td className="p-5">{record.odometer}</td>
                                <td className="p-5">{record.vehicle_condition}</td>
                                <td className="p-5">{record.sale_location}</td>
                                <td className="p-5">{record.sale_category}</td>
                                <td className="p-5">{record.salvage_vehicle === true ? 'Yes' : 'No'}</td>
                                <td className="p-5">{formatDate(record.sale_date)}</td>
                                <td className="p-5">
                                    {isLoggedIn
                                        ? (record.price === undefined ? 'N/A' : `$${record.price.toLocaleString()}`)
                                        : (
                                            <div className="flex flex-col items-start gap-2">
                                                <span className="text-gray-400">Login to see</span>
                                                <button
                                                    className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => { navigate('/login') }}
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        )
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataTable 