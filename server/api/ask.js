export default defineEventHandler(async (event) => {
  try {
    // Get request method
    const method = event.node.req.method

    // Handle GET requests
    if (method === 'GET') {
      return {
        message: 'GET request successful'
      }
    }

    // Handle POST requests
    if (method === 'POST') {
      // Get the request body
      const body = await readBody(event)
      
      // Process the request...
      
      return {
        message: 'POST request successful',
        data: body
      }
    }

    // Handle other methods
    return createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })

  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
