import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { PersonForm } from './PersonForm'

test('person form renders content', () => {
 

  render(<PersonForm />)

  const element = screen.getByText('number:')
  expect(element).toBeDefined()
})