import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import CreatorPage from "./pages/CreatorPage";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/creators/creator_001" replace />} />
      		<Route path="/creators/:id" element={<CreatorPage />} />
			<Route
				path="*"
				element={
					<div className="p-24">
						<h2>404</h2>
						<p>Page not found</p>
					</div>
				}
			/>
		</Routes>
	
	);
};

export default App;
