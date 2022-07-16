const config = {
	duration: 750,
	newWindow: true,
	close: false,
	gravity: "bottom",
	position: "right",
	stopOnFocus: true,
	text: "sin mensaje",
	style: {
		background: "#65a30d",
		color: "white",
	},
};

const mensajeExito = (mensaje) => {
	if (!mensaje) return;
	Toastify({
		...config,
		text: mensaje,
		style: {
			background: "#65a30d",
			color: "white",
		},
	}).showToast();
};

const mensajeError = (mensaje) => {
	if (!mensaje) return;
	Toastify({
		...config,
		text: mensaje,
		style: {
			background: "#dc2626",
			color: "white",
		},
	}).showToast();
};