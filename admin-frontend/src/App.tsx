import { AuthProvider, ThemeProvider } from './common/context'
import AllRoutes from './routes/Routes'

import './assets/scss/app.scss'
import './assets/scss/icons.scss'


function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<AllRoutes />
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App
