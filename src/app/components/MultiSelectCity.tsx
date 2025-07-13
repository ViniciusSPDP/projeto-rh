'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X, MapPin, Search } from 'lucide-react'

interface MultiSelectCityProps {
  name: string
  selectedCities: string[]
  availableCities: string[]
  placeholder?: string
  className?: string
}

export default function MultiSelectCity({ 
  name,
  selectedCities, 
  availableCities, 
  placeholder = "Selecione cidades...",
  className = ""
}: MultiSelectCityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedCities)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInternalSelected(selectedCities)
  }, [selectedCities])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCityToggle = (city: string) => {
    const newSelected = internalSelected.includes(city)
      ? internalSelected.filter(c => c !== city)
      : [...internalSelected, city]
    
    setInternalSelected(newSelected)
  }

  const removeCityFromSelection = (cityToRemove: string) => {
    const newSelected = internalSelected.filter(c => c !== cityToRemove)
    setInternalSelected(newSelected)
  }

  const clearAll = () => {
    setInternalSelected([])
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input hidden para o formulário */}
      <input 
        type="hidden" 
        name={name} 
        value={internalSelected.join(',')} 
      />
      
      {/* Campo principal */}
      <div
        className="min-h-[48px] pl-3 pr-10 py-2 border border-blue-200 rounded-lg bg-white text-blue-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all hover:border-blue-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 min-h-[32px] items-center">
          {internalSelected.length === 0 ? (
            <span className="text-gray-500 py-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {placeholder}
            </span>
          ) : (
            <>
              {internalSelected.slice(0, 2).map(city => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm max-w-[120px]"
                >
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{city}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCityFromSelection(city);
                    }}
                    className="hover:text-blue-600 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {internalSelected.length > 2 && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  +{internalSelected.length - 2} mais
                </span>
              )}
              
              {internalSelected.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Limpar seleção"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Ícone de dropdown */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className={`h-4 w-4 text-blue-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-3 border-b border-blue-100 bg-gray-50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          {/* Lista de cidades */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCities.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                {searchTerm ? 'Nenhuma cidade encontrada' : 'Nenhuma cidade disponível'}
              </div>
            ) : (
              <>
                {/* Opção "Selecionar todas" */}
                {filteredCities.length > 1 && (
                  <div className="border-b border-gray-100">
                    <div
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-sm font-medium text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        const allSelected = filteredCities.every(city => internalSelected.includes(city));
                        if (allSelected) {
                          // Remove todas as cidades filtradas
                          setInternalSelected(prev => prev.filter(city => !filteredCities.includes(city)));
                        } else {
                          // Adiciona todas as cidades filtradas
                          const newCities = filteredCities.filter(city => !internalSelected.includes(city));
                          setInternalSelected(prev => [...prev, ...newCities]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filteredCities.every(city => internalSelected.includes(city)) && filteredCities.length > 0}
                        onChange={() => {}} // Controlled by parent click
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>
                        {filteredCities.every(city => internalSelected.includes(city)) 
                          ? 'Desmarcar todas' 
                          : 'Selecionar todas'
                        } ({filteredCities.length})
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Lista de cidades individuais */}
                {filteredCities.map(city => (
                  <div
                    key={city}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCityToggle(city);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={internalSelected.includes(city)}
                      onChange={() => {}} // Controlled by parent click
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-blue-900 flex-1">{city}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Footer com contador */}
          {internalSelected.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 flex items-center justify-between">
              <span>
                {internalSelected.length} cidade{internalSelected.length !== 1 ? 's' : ''} selecionada{internalSelected.length !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}