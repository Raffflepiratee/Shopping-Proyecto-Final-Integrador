import { useEffect, useState } from "react"

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
}

export default function CheckoutForm({ onChange }) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({
        data: form,
        isValid: Object.values(form).every((value) => value.trim().length > 0),
      })
    }
  }, [form, onChange])

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextForm = {
      ...form,
      [name]: value,
    }

    setForm(nextForm)
  }

  return (
    <form className="checkout-form">
      <label>
        Nombre
        <input name="firstName" type="text" value={form.firstName} onChange={handleChange} required />
      </label>

      <label>
        Apellido
        <input name="lastName" type="text" value={form.lastName} onChange={handleChange} required />
      </label>

      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Teléfono
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
      </label>

      <label>
        Dirección
        <input name="address" type="text" value={form.address} onChange={handleChange} required />
      </label>
    </form>
  )
}
