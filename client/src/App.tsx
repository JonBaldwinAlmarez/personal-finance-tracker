import { AppLayout } from "@/layout/AppLayout";
import { AiAdvicePage } from "@/pages/AiAdvicePage";
import { ChartsPage } from "@/pages/ChartsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path="charts" element={<ChartsPage />} />
				<Route path="advice" element={<AiAdvicePage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
