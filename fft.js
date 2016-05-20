function fft(N) {
	var xr = new Array();
	var xi = new Array();
	var theta = 0;
	var fs = 48000;
	var fc = 10000;
	var SNR_dB = 10;
	
	// Init input vector
	for (i = 0; i < N; i++) {
		xr[i] = Math.cos(theta);
		xi[i] = Math.sin(theta);
		theta += 2 * Math.PI * fc / fs;
		xr[i] += Math.pow(10, (-SNR_dB / 20)) * (2 * Math.random() - 1);
		xi[i] += Math.pow(10, (-SNR_dB / 20)) * (2 * Math.random() - 1);
	}
	
	// FFT algorithm
	var pi = Math.PI;
	var NM1 = N - 1;
	var ND2 = N / 2;
	var M = Math.log(N) / Math.log(2);
	var j = ND2;

	// First step : Bit reversal sorting
	for (i = 1; i <= N - 2; i++) {
		if (i < j) {
			TR = xr[j];
			TI = xi[j];
			xr[j] = xr[i];
			xi[j] = xi[i];
			xr[i] = TR;
			xi[i] = TI;
		}
		k = ND2;
		while (k <= j) {
			j = j - k;
			k = k / 2;
		}
		j = j + k;
	}

	// Step 2 : Compute each stage
	for (l = 1; l <= M; l++) {
		LE = Math.round(Math.pow(2, l));
		LE2 = LE / 2;
		UR = 1;
		UI = 0;
		SR = Math.cos(pi / LE2);
		SI = -Math.sin(pi / LE2);
		// Loop over each sub-dft
		for (j = 1; j <= LE2; j++) {
			JM1 = j - 1;
			// Loop over butterflies
			for (i = JM1; i <= NM1; i = i + LE) {
				IP = i + LE2;
				TR = xr[IP] * UR - xi[IP] * UI;
				TI = xr[IP] * UI + xi[IP] * UR;
				xr[IP] = xr[i] - TR;
				xi[IP] = xi[i] - TI;
				xr[i] = xr[i] + TR;
				xi[i] = xi[i] + TI;
			}
			TR = UR;
			UR = TR * SR - UI * SI;
			UI = TR * SI + UI * SR;
		}
	}
	for (k = 0; k < N; k++) {
		console.log(xr[k] + " " + xi[k] + ";");
	}
}
