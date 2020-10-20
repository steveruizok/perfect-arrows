import { createStyled } from "@stitches/react"

const { css, styled } = createStyled({
	tokens: {
		colors: {
			$background: "rgba(245, 245, 245, 1.000)",
			$text: "rgba(0, 0, 0, 1.000)",
			$accent: "rgba(77, 223, 234, 1.000)",
			$select: "rgba(77, 223, 234, 1.000)",
			$muted: "rgba(220, 220, 224, 1.000)",
			$icon: "#efefef",
			$canvas: "#efefef",
			$toolbar: "rgba(240, 240, 240, .5)",
		},
		space: {
			$0: "4px",
			$1: "8px",
			$2: "12px",
			$3: "16px",
			$4: "24px",
			$6: "32px",
			$7: "40px",
			$8: "64px",
			$9: "96px",
			$10: "128px",
		},
		radii: {
			$0: "2px",
			$1: "4px",
		},
		fontSizes: {
			$0: "10px",
			$1: "12px",
			$2: "14px",
		},
	},
	utils: {
		m: () => (value: number | string) => ({
			marginTop: value,
			marginBottom: value,
			marginLeft: value,
			marginRight: value,
		}),
		mt: () => (value: number | string) => ({
			marginTop: value,
		}),
		mr: () => (value: number | string) => ({
			marginRight: value,
		}),
		mb: () => (value: number | string) => ({
			marginBottom: value,
		}),
		ml: () => (value: number | string) => ({
			marginLeft: value,
		}),
		mx: () => (value: number | string) => ({
			marginLeft: value,
			marginRight: value,
		}),
		my: () => (value: number | string) => ({
			marginTop: value,
			marginBottom: value,
		}),
		p: () => (value: number | string) => ({
			paddingTop: value,
			paddingBottom: value,
			paddingLeft: value,
			paddingRight: value,
			padding: value,
		}),
		pt: () => (value: number | string) => ({
			paddingTop: value,
		}),
		pr: () => (value: number | string) => ({
			paddingRight: value,
		}),
		pb: () => (value: number | string) => ({
			paddingBottom: value,
		}),
		pl: () => (value: number | string) => ({
			paddingLeft: value,
		}),
		px: () => (value: number | string) => ({
			paddingLeft: value,
			paddingRight: value,
		}),
		py: () => (value: number | string) => ({
			paddingTop: value,
			paddingBottom: value,
		}),
		size: () => (value: number | string) => ({
			width: value,
			height: value,
		}),
		bg: () => (value: string) => ({
			backgroundColor: value,
		}),
		fadeBg: () => (value: number) => ({
			transition: `background-color ${value}s`,
		}),
	},
})

export { css, styled }
