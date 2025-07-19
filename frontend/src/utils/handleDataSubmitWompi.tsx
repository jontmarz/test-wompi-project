import { CartItem, PaymentData, WompiConfig } from '../types'

const generateIntegritySignature = async (reference: string, amountInCents: number, currency: string, integrityKey: string): Promise<string> => {
    // Concatenar los valores en el orden exacto requerido por Wompi
    const concatenatedString = `${reference}${amountInCents}${currency}${integrityKey}`
    
    console.log('Signature data:', { reference, amountInCents, currency, integrityKeyLength: integrityKey.length })
    console.log('Concatenated string for signature:', concatenatedString)
    
    // Generar hash SHA256
    const encoder = new TextEncoder()
    const data = encoder.encode(concatenatedString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    
    // Convertir a hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    console.log('Generated hash:', hashHex)
    return hashHex
}

const loadWompiScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (window.WidgetCheckout) {
            resolve()
            return
        }

        const existingScript = document.getElementById('wompi-script')
        if (existingScript) {
            const checkWidget = () => {
                if (window.WidgetCheckout) {
                    resolve()
                } else {
                    setTimeout(checkWidget, 100)
                }
            }
            checkWidget()
            return
        }

        const script = document.createElement('script')
        script.id = 'wompi-script'
        script.src = 'https://checkout.wompi.co/widget.js'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Wompi script'))
        document.body.appendChild(script)
    })
}

const waitForWompi = async (): Promise<void> => {
    const maxAttempts = 20
    let attempts = 0

    while (attempts < maxAttempts) {
        if (window.WidgetCheckout) return

        if (attempts === 0) {
            await loadWompiScript().catch(console.error)
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
        attempts++
    }

    throw new Error('Wompi widget failed to load after multiple attempts')
}

const handleDataSubmitWompi = async (
    cartItems: CartItem[],
    paymentData: PaymentData,
    totalAmount: number
): Promise<string> => {
    const { name, email, phone } = paymentData.customerData
    
    if (!name || !email) {
        throw new Error('Datos del cliente incompletos')
    }

    try {
        console.log('🚀 Iniciando waitForWompi...')
        await waitForWompi()
        console.log('✅ Wompi cargado exitosamente')

        // Obtener configuración desde variables de entorno
        const environment = (import.meta.env.VITE_ENVIRONMENT as 'development' | 'production') || 'development'
        
        console.log('🔧 Variables de entorno disponibles:', {
            VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
            VITE_WOMPI_PUBLIC_KEY_TEST: import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST ? import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST.substring(0, 15) + '...' : 'no disponible',
            VITE_WOMPI_PUBLIC_KEY_PROD: import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD ? import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD.substring(0, 15) + '...' : 'no disponible'
        })
        
        const apiKey = environment === 'production'
            ? import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD || 'pub_stagint_fjIqRyHmHvmqYgPFCO5nibfrtraL6ixq'
            : import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST || 'pub_test_m3bKjfQWfgOuYOhrrFoI8qjrV9E40jKJ'

        const integrityKey = environment === 'production'
            ? import.meta.env.VITE_WOMPI_INTEGRITY_KEY_PROD
            : import.meta.env.VITE_WOMPI_INTEGRITY_KEY_TEST || ''

        console.log('Environment:', environment)
        console.log('API Key disponible:', !!apiKey)
        console.log('API Key prefix:', apiKey ? apiKey.substring(0, 15) + '...' : 'NO DISPONIBLE')

        if (!apiKey) {
            throw new Error(`API key not found for environment: ${environment}`)
        }

        // Generar un reference único
        const generateUniqueReference = () => {
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substr(2, 9)
            const randomNum = Math.floor(Math.random() * 10000)
            const userHash = btoa(email.substr(0, 3) + name.substr(0, 3)).replace(/[^a-zA-Z0-9]/g, '').substr(0, 4)
            return `order_${timestamp}_${randomStr}_${randomNum}_${userHash}`
        }

        const reference = generateUniqueReference()
        
        // Verificar que el reference no se haya usado recientemente
        const usedReferences = JSON.parse(localStorage.getItem('usedReferences') || '[]')
        if (usedReferences.includes(reference)) {
            throw new Error('Reference already used. Please try again.')
        }
        
        // Almacenar el reference como usado (mantener solo los últimos 10)
        usedReferences.push(reference)
        if (usedReferences.length > 10) {
            usedReferences.shift()
        }
        localStorage.setItem('usedReferences', JSON.stringify(usedReferences))

        const cleanPhone = phone ? phone.replace(/^\+?57/, '').replace(/\D/g, '').trim() : '3000000000'

        console.log('Generated reference:', reference)
        console.log('Payment details:', { reference, amount: totalAmount, phone: cleanPhone })

        // Generar la firma de integridad solo en producción
        const amountInCents = Math.round(totalAmount * 100)
        const currency = 'COP'
        
        let integritySignature: string | null = null
        if (environment === 'production' && integrityKey) {
            integritySignature = await generateIntegritySignature(reference, amountInCents, currency, integrityKey)
            console.log('Integrity signature generated for production:', integritySignature.substring(0, 16) + '...')
        } else {
            console.log('Skipping integrity signature for non-production environment')
        }

        const config: WompiConfig = {
            currency,
            amountInCents,
            reference,
            publicKey: apiKey,
            redirectUrl: `${window.location.origin}/status`,
            customerData: {
                email,
                fullName: name,
                phoneNumber: cleanPhone,
                phoneNumberPrefix: '+57'
            }
        }

        // No agregamos signature en ambiente de test/development
        console.log('Final Wompi config:', {
            ...config,
            publicKey: config.publicKey?.substring(0, 20) + '...',
            amountInCents: config.amountInCents,
            currency: config.currency,
            reference: config.reference
        })

        if (!window.WidgetCheckout) {
            throw new Error('Wompi Widget not available')
        }

        const checkout = new window.WidgetCheckout(config)
        checkout.open((response: any) => {
            console.log('Wompi transaction response:', response)
            // Aquí puedes manejar la respuesta del pago
            if (response.transaction && response.transaction.status === 'APPROVED') {
                // Pago aprobado, redirigir a página de éxito
                window.location.href = `/status?reference=${reference}&status=approved`
            } else {
                // Pago fallido o cancelado
                window.location.href = `/status?reference=${reference}&status=failed`
            }
        })

        return reference
    } catch (error: any) {
        console.error('Error processing Wompi payment:', error)
        throw new Error(`Error al procesar el pago: ${error?.message || error}`)
    }
}

export default handleDataSubmitWompi