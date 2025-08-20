import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import SkeletonCheckboxList from "./SkeletonCheckboxList"

// Types para el componente
interface FilterItem {
  id: string | number;
  label: string;
}

interface FilterAccordionProps {
  title: string
  query: any // 👈 el documento GraphQL que le pasas (ej: GET_ALL_COLORS)
  mapItems: (data: any) => FilterItem[] // 👈 cómo transformar la respuesta en items
  selectedItems: (string | number)[] // 👈 items seleccionados
  onToggle: (id: string | number) => void // 👈 función para toggle
  timeout?: number // ⏱️ tiempo máximo en ms
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({ 
  title, 
  query, 
  mapItems, 
  selectedItems = [], // 👈 valor por defecto
  onToggle, 
  timeout = 5000 
}) => {
  const { loading, data, error } = useQuery(query)
  const [timeoutError, setTimeoutError] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (loading) {
      timer = setTimeout(() => setTimeoutError(true), timeout)
    } else {
      setTimeoutError(false)
    }
    return () => clearTimeout(timer)
  }, [loading, timeout])

  const items: FilterItem[] = !loading && !error && !timeoutError ? mapItems(data) : []

  const handleToggle = (itemId: string | number): void => {
    if (onToggle) {
      onToggle(itemId);
    }
  };

  return (
    <div className="mb-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={title.toLowerCase()} className="border-none">
          <AccordionTrigger className="font-medium text-left hover:no-underline py-3 px-0">
            {title}
            {/* Mostrar contador de items seleccionados */}
            {selectedItems.length > 0 && (
              <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                {selectedItems.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="space-y-2">

              {/* Loading */}
              {loading && !error && !timeoutError && (
                <SkeletonCheckboxList count={6} />
              )}

              {/* Timeout error */}
              {timeoutError && (
                <div className="text-center bg-red-200 p-5 rounded-md">
                  <p className="text-red-600 text-sm">Failed to fetch {title.toLowerCase()} (timeout)</p>
                </div>
              )}

              {/* Server error */}
              {!loading && error && (
                <div className="text-center bg-red-200 p-5 rounded-md">
                  <p className="text-red-600 text-sm">Failed to fetch {title.toLowerCase()}: {error.message}</p>
                </div>
              )}

              {/* Lista de items */}
              {items.map((item: FilterItem) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${title}-${item.id}`}
                    checked={selectedItems.includes(item.id)} // 👈 verificar si está seleccionado
                    onCheckedChange={() => handleToggle(item.id)} // 👈 manejar el toggle
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label 
                    htmlFor={`${title}-${item.id}`} 
                    className={`text-sm cursor-pointer ${
                      selectedItems.includes(item.id) 
                        ? 'text-purple-700 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </label>
                </div>
              ))}

              {/* Mostrar mensaje si no hay items */}
              {!loading && !error && !timeoutError && items.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No hay {title.toLowerCase()} disponibles</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default FilterAccordion;