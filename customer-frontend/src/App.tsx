import { AuthProvider, ThemeProvider } from './common/context'
import AllRoutes from './routes/Routes'
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51NGJaIF9Bg87hu38fTGnl2wSu0apMlInZQmTufVbbw58RRMP7ejp0Vekzvw417hxIbWYKUwEHaUzP1T6YBnhmzqr00wpLba6td');

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
