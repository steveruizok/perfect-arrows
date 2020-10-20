import * as React from "react"
import state from "../state"
import { useStateDesigner } from "@state-designer/react"

export default function Model() {
	const local = useStateDesigner(state)

	const { camera } = local.data

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				pointerEvents: "none",
			}}
		>
			<div
				style={{
					width: 720,
					height: 400,
					backgroundColor: "#fff",
				}}
			>
				<svg
					viewBox={"0 0 720 400"}
					fontFamily="Helvetica Neue"
					fontSize="14"
					fontWeight="bold"
				>
					<defs>
						<clipPath id="canvas">
							<rect x="200" y="100" width="320" height="200" fill="none" />
						</clipPath>
					</defs>
					<g transform={`translate(${-camera.x} ${-camera.y})`}>
						<rect width={500} height={320} fill="rgba(0,0,0,.16)" />
						<text x="12" y="308" opacity={0.5}>
							Document
						</text>
					</g>
					<g>
						<rect
							x="200"
							y="100"
							width="320"
							height="200"
							stroke="rgba(0,0,0,.5)"
							strokeWidth={2}
							fill="rgba(255, 255, 255, 1)"
						/>
						<text x="12" y="122" opacity={0.5}>
							ViewBox
						</text>
					</g>
					<g clip-path="url(#canvas)">
						<g transform={`translate(${-camera.x} ${-camera.y})`}>
							<rect width={500} height={320} fill="rgba(0,0,0,.26)" />
							<text x="12" y="308">
								Document
							</text>
						</g>
					</g>
				</svg>
			</div>
		</div>
	)
}
