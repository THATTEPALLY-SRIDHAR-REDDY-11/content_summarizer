// Vercel-compatible handler wrapper
import app from '../server/app.js';

export default function handler(req, res) {
	try {
		return app(req, res);
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.end('Internal Server Error');
	}
}