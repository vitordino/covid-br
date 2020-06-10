const decimal = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
const integer = { minimumFractionDigits: 0, maximumFractionDigits: 0 }

const numToString = (n: number, isDecimal: boolean) =>
	n.toLocaleString('pt-BR', isDecimal ? decimal : integer)

export default numToString
