import 'dotenv/config'
import { createAdminIfNotExists } from '../services/auth.service.js'

async function run() {
  const email = 'adminbono@gmail.com'
  const password = 'admin27'

  const res = await createAdminIfNotExists(email, password)
  if (res) {
    console.log('Admin user created or already exists:', email)
  } else {
    console.error('Failed to create admin user')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
