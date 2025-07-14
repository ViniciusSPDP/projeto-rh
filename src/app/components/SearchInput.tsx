'use client'

import { useState, useEffect } from 'react'

interface SearchInputProps {
  name: string
  defaultValue?: string
  placeholder?: string
  className?: string
}

export default function SearchInput({
  name,
  defaultValue = '',
  placeholder = '',
  className = ''
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)
  const [isCPF, setIsCPF] = useState(false)

  useEffect(() => {
    setValue(defaultValue)
    // Verifica se o valor inicial é um CPF
    setIsCPF(isNumericInput(defaultValue))
  }, [defaultValue])

  // Função para verificar se o input contém apenas números
  const isNumericInput = (str: string): boolean => {
    const numbersOnly = str.replace(/\D/g, '')
    return str.length > 0 && numbersOnly.length === str.replace(/[.\-\s]/g, '').length
  }

  // Função para aplicar máscara de CPF
  const applyCPFMask = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara progressivamente
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    }
  }

  // Função para remover máscara (para busca)
  const removeMask = (value: string): string => {
    return value.replace(/\D/g, '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const numbersOnly = removeMask(inputValue)
    
    // Detecta se está digitando números (possível CPF)
    const isTypingNumbers = /^\d+$/.test(numbersOnly) && numbersOnly.length > 0
    
    if (isTypingNumbers && numbersOnly.length <= 11) {
      // Aplica máscara de CPF
      const maskedValue = applyCPFMask(inputValue)
      setValue(maskedValue)
      setIsCPF(true)
    } else if (inputValue === '') {
      // Campo vazio
      setValue('')
      setIsCPF(false)
    } else {
      // Texto normal (nome/email)
      setValue(inputValue)
      setIsCPF(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }
    
    // Se estiver no modo CPF e já tem 11 números, bloqueia mais números
    if (isCPF && removeMask(value).length >= 11 && /\d/.test(e.key)) {
      e.preventDefault()
    }
  }

  const getPlaceholder = (): string => {
    if (isCPF && value.length > 0) {
      return 'Ex: 486.429.448-89'
    }
    return placeholder
  }

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={getPlaceholder()}
      className={className}
      aria-label="Buscar candidatos por nome, email ou CPF"
      autoComplete="off"
    />
  )
}