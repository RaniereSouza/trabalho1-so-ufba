$(document).ready(function () {

	let processosArray = [],
		quantum = 3,
		ctx = $('#grafico-de-execucao')[0].getContext('2d'),
		arrayDeCores = [
			'red',
			'blue',
			'lime',
			'yellow',
			'orange',
			'pink',
			'green',
			'aqua',
			'brown',
			'deeppink',
			'darkblue',
			'darkred',
			'darkgreen',
			'darkorange',
			'mediumpurple',
			'darkgoldenrod',
		],
		myChart;

	$('.header-title').text('Trabalho de SO - Escalonamento de Processos');

	$('#quantum-form #quantum').val(String(quantum));






	function corRandom () {

		let len = arrayDeCores.length;

		return arrayDeCores[Math.floor(Math.random() * len)]; 
	}






	function clonarArray (array) {

		let result = array.map(function (element) {

				return 	jQuery.extend(true, {}, element);
			});

		return result;
	}






	function desenharGraficoExecucao (algoritmo, arrayExecucao, tempoMedio) {

		let options = {
		    	title: {
		    		display: true,
		    		fontSize: 21,
		    		fontColor: '#111',
		    		//text: 'Título do Meu Gráfico'
		    	},
		        scales: {
		            xAxes: [{
		                type: 'linear',
		                position: 'bottom',
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'tempo (u.t.)'
		            	}
		            }],
		            yAxes: [{
		            	ticks: {
		            		beginAtZero: true
		            	},
		            	scaleLabel: {
		            		display: true,
		            		labelString: '# dos processos'
		            	}
		            }]
		        },
		        layout: {
		        	padding: 15
		        }
		    },
		    datasets = [],
		    tempoEspera = {
		    	label: 'Tempo de Espera',
	            borderWidth: 3,
	            borderColor: 'gray',
	            borderDash: [5, 5],
	            fill: false,
	            data: []
		    },
		    preempcao = {
		    	label: 'Preempção',
	            borderWidth: 3,
	            borderColor: 'black',
	            fill: false,
	            data: []
		    },
		    chartObj = {
		    	type: 'line',
		    	data: {}
		    };

		if (algoritmo == '1') {

			options.title.text = 'Gráfico de Execução - FIFO (throughput médio: ' +
								 tempoMedio.toFixed(2) + ' u.t.)';

			arrayExecucao.forEach(function (element, index) {
				
				let execObj = {
						label: 'Processo ' + element.nome + ' (#' + (index + 1) + ')',
			            borderWidth: 3,
			            borderColor: corRandom(),
			            fill: true,
			            data: [
			            	{
			            		x: element.chegada + element.emEspera,
			            		y: index + 1
			            	},
			            	{
			            		x: element.chegada + element.emEspera + element.tempoExecucao,
			            		y: index + 1
			            	}
			            ]
					};
				
				if (element.emEspera > 0) {

					tempoEspera.data.push(NaN);

					tempoEspera.data.push({
						x: element.chegada,
						y: index + 1
					});

					tempoEspera.data.push({
						x: element.chegada + element.emEspera,
						y: index + 1
					});
				}

				datasets.push(execObj);
			});

			datasets.push(tempoEspera);

			chartObj.data.datasets = datasets;
			chartObj.options = options;

			console.log('chartObj:', chartObj);

			if (typeof(myChart) !== 'undefined') {

				myChart.destroy();
			}

			myChart = new Chart(ctx, chartObj);
		}
		else if (algoritmo == '2') {

			options.title.text = 'Gráfico de Execução - SJF (throughput médio: ' +
								 tempoMedio.toFixed(2) + ' u.t.)';

			arrayExecucao.forEach(function (element, index) {
				
				let execObj = {
						label: 'Processo ' + element.nome + ' (#' + (index + 1) + ')',
			            borderWidth: 3,
			            borderColor: corRandom(),
			            fill: true,
			            data: [
			            	{
			            		x: element.chegada + element.emEspera,
			            		y: index + 1
			            	},
			            	{
			            		x: element.chegada + element.emEspera + element.tempoExecucao,
			            		y: index + 1
			            	}
			            ]
					};
				
				if (element.emEspera > 0) {

					tempoEspera.data.push(NaN);

					tempoEspera.data.push({
						x: element.chegada,
						y: index + 1
					});

					tempoEspera.data.push({
						x: element.chegada + element.emEspera,
						y: index + 1
					});
				}

				datasets.push(execObj);
			});

			datasets.push(tempoEspera);

			chartObj.data.datasets = datasets;
			chartObj.options = options;

			console.log('chartObj:', chartObj);

			if (typeof(myChart) !== 'undefined') {

				myChart.destroy();
			}

			myChart = new Chart(ctx, chartObj);
		}
		else if (algoritmo == '3') {

			options.title.text = 'Gráfico de Execução - RR (throughput médio: ' +
								 tempoMedio.toFixed(2) + ' u.t.)';

			let nomesProcessos = [],
				execObjProcessos = [],
				preempcaoCounters = [],
				lastExecEnds = [];

			arrayExecucao.forEach(function (element, index) {

				let yProcesso = 0;

				if (nomesProcessos.indexOf(element.nome) < 0) {

					if (element.nome !== '_SOBRECARGA_') {

						nomesProcessos.push(element.nome);

						execObjProcessos.push({
							label: 'Processo ' + element.nome,
				            borderWidth: 3,
				            borderColor: corRandom(),
				            fill: true,
				            data: [],
				            preempcaoCounter: 0
						});

						preempcaoCounters.push(0);

						lastExecEnds.push(null);

						yProcesso = nomesProcessos.length;

						execObjProcessos[yProcesso - 1].label += ' (#' + yProcesso + ')';
					}
					else {

						yProcesso = nomesProcessos.indexOf(arrayExecucao[index - 1].nome) + 1;
					}
				}
				else {

					yProcesso = nomesProcessos.indexOf(element.nome) + 1;
				}

				if (element.nome !== '_SOBRECARGA_') {

					let xExecStart = element.chegada,
						xExecEnd = element.chegada;

					xExecEnd += element.jaExecutado + element.emEspera;

					if (element.jaExecutado % quantum === 0) {

						xExecStart += (element.jaExecutado - quantum) + element.emEspera;	
					}
					else {

						xExecStart += (element.jaExecutado - (element.jaExecutado % quantum)) + element.emEspera;
					}

					execObjProcessos[yProcesso - 1].data.push({
						x: xExecStart,
						y: yProcesso
					});

					execObjProcessos[yProcesso - 1].data.push({
						x: xExecEnd,
						y: yProcesso
					});

					let xEspStart = 0,
						xEspEnd = xExecStart;

					if (lastExecEnds[yProcesso - 1] === null) {

						xEspStart = element.chegada;
					}
					else {

						xEspStart = lastExecEnds[yProcesso - 1];

						if (execObjProcessos[yProcesso - 1].preempcaoCounter <
						   preempcaoCounters[yProcesso - 1]) {

							xEspStart++;

							execObjProcessos[yProcesso - 1].preempcaoCounter = preempcaoCounters[yProcesso - 1];
						}
					}

					lastExecEnds[yProcesso -1] = xExecEnd;

					tempoEspera.data.push({
						x: xEspStart,
						y: yProcesso
					});

					tempoEspera.data.push({
						x: xEspEnd,
						y: yProcesso
					});

					tempoEspera.data.push(NaN);
				}
				else {

					preempcaoCounters[yProcesso - 1]++;
					
					let lastExec = arrayExecucao[index - 1];

					//console.log('lastExec:', lastExec);

					preempcao.data.push({
						x: lastExec.chegada + lastExec.emEspera + lastExec.jaExecutado,
						y: yProcesso
					});

					preempcao.data.push({
						x: lastExec.chegada + lastExec.emEspera + lastExec.jaExecutado + 1,
						y: yProcesso
					});

					if (lastExec.jaExecutado < lastExec.tempoExecucao) {

						preempcao.data.push(NaN);
					}

					execObjProcessos[yProcesso - 1].data.push(NaN);
				}
			});

			//console.log('execObjProcessos:', execObjProcessos);

			datasets = execObjProcessos;

			datasets.push(tempoEspera);
			datasets.push(preempcao);

			chartObj.data.datasets = datasets;
			chartObj.options = options;

			console.log('chartObj:', chartObj);

			if (typeof(myChart) !== 'undefined') {

				myChart.destroy();
			}

			myChart = new Chart(ctx, chartObj);
		}
		else if (algoritmo == '4') {

			options.title.text = 'Gráfico de Execução - EDF';
		}
	}






	$('#quantum-form').on('submit', function (e) {

		e.preventDefault();

		if (($(e.target).find('#quantum').val()) &&
		   (Number($(e.target).find('#quantum').val()) !== quantum)) {

		   	console.log('alterando quantum para', Number($(e.target).find('#quantum').val()));

			quantum = Number($(e.target).find('#quantum').val());
		}
	});






	$('#processo-form').on('submit', function (e) {

		e.preventDefault();

		let processoObj = {
				nome: $(e.target).find('#nome').val(),
				chegada: Number($(e.target).find('#chegada').val()),
				tempoExecucao: Number($(e.target).find('#tempoExecucao').val()),
				jaExecutado: 0,
				emEspera: 0,
				estado: 'criado',
				//prioridade: Number($(e.target).find('#prioridade').val()),
				deadline: Number($(e.target).find('#deadline').val()),
			};

		$('#fila-de-processos').append('<div class="processo-wrapper">' +
			                               '<p>Nome: ' + processoObj.nome + '</p>' +
			                               '<p>Chegada: ' + processoObj.chegada + '</p>' +
			                               '<p>Tempo de execução: ' + processoObj.tempoExecucao + '</p>' +
			                               //'<p>Prioridade: ' + processoObj.prioridade + '</p>' +
			                               '<p>Deadline: ' + processoObj.deadline + '</p>' +
			                           '</div>');

		processosArray.push(processoObj);

		e.target.reset();

		console.log(processosArray);
	});






	$('#algoritmo-form').on('submit', function (e) {

		e.preventDefault();

		console.log('fila de processos:', processosArray);

		let processosParaExecutar = processosArray.length,
			processosArrayCopia = clonarArray(processosArray); //tentativa de manter o array original intacto para a axecução de outros algoritmos

		let porChegada = function (a, b) {

				return (a.chegada - b.chegada);
			},
			porTempoExecucao = function (a, b) {

				return (a.tempoExecucao - b.tempoExecucao);
			},
			porDeadline = function (a, b) {

				return (a.deadline - b.deadline);
			};

		if (processosParaExecutar > 0) {

			let algoritmo = $(e.target).find('#algoritmos').val();

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if (algoritmo == '1') {

				console.log('First In, First Out!');

				let processosExecucao = clonarArray(processosArrayCopia);

				processosExecucao.sort(porChegada);

				processosExecucao.forEach(function (element, index) {

					//let element = e;

					element.jaExecutado = element.tempoExecucao;

					if (index > 0) {

						element.emEspera = (processosExecucao[index - 1].chegada +
										   processosExecucao[index - 1].emEspera +
										   processosExecucao[index - 1].tempoExecucao) -
										   element.chegada; 
					}

					element.estado = 'finalizado';

					return element;
 				});

				console.log(processosExecucao);

				let tempoMedio = 0;

				processosExecucao.forEach(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');

				desenharGraficoExecucao(algoritmo, processosExecucao, tempoMedio);

				processosArrayCopia = clonarArray(processosArray);
			}
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			else if (algoritmo == '2') {

				console.log('Smallest Job First!');

				let escalonamentoArray = [],
					processosExecucao = [],
					cicloAtual = 0,
					indexAtual = null
					executandoAgora = {};

				processosArrayCopia.sort(porChegada);

				while (processosParaExecutar > 0) {

					if ((indexAtual !== null) &&
					   (processosArrayCopia[indexAtual].estado === 'executando')) {

						executandoAgora = processosArrayCopia[indexAtual];

						if (executandoAgora.jaExecutado === executandoAgora.tempoExecucao) {

							console.log('Tick', cicloAtual);
							console.log('Processo', executandoAgora.nome,': executando > finalizado');

							executandoAgora.estado = 'finalizado';

							processosExecucao.push(executandoAgora);

							processosParaExecutar--;
						}
						else {

							executandoAgora.jaExecutado++;
						}
					}

					processosArrayCopia.forEach(function (element, index) {

						if ((element.chegada <= cicloAtual)) {

							if (element.estado === 'criado') {

								console.log('Tick', cicloAtual);
								console.log('Processo', element.nome,': criado > pronto');

								element.estado = 'pronto';

								escalonamentoArray.push(element);

								escalonamentoArray.sort(porTempoExecucao);

								//element.emEspera++;
							}
							else if (element.estado === 'pronto') {

								if (((indexAtual === null) ||
								   (processosArrayCopia[indexAtual].estado === 'finalizado')) &&
								   (escalonamentoArray[0].nome === element.nome)) {

									console.log('Tick', cicloAtual);
								   	console.log('Processo', element.nome,': pronto > executando');

									indexAtual = index;

									escalonamentoArray.splice(0, 1);

									element.estado = 'executando';

									element.jaExecutado++;
								}
								else {

									element.emEspera++;
								}
							}
						}
					});

					cicloAtual++;
				}

				console.log(processosExecucao);

				let tempoMedio = 0;

				processosParaExecutar = processosArray.length;

				processosExecucao.forEach(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');

				desenharGraficoExecucao(algoritmo, processosExecucao, tempoMedio);
				
				processosArrayCopia = clonarArray(processosArray);
			}
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			else if (algoritmo == '3') {

				console.log('Round-Robin!');

				let escalonamentoArray = [],
					processosExecucao = [],
					cicloAtual = 0,
					indexAtual = null;

				processosArrayCopia.sort(porChegada);

				while (processosParaExecutar > 0) {

					if (indexAtual !== null) {

						executandoAgora = processosArrayCopia[indexAtual];

						if (processosArrayCopia[indexAtual].estado === 'executando') {

							if (executandoAgora.jaExecutado >= executandoAgora.tempoExecucao) {

								console.log('Tick', cicloAtual);
								console.log('Processo', executandoAgora.nome,': executando > finalizado');

								executandoAgora.estado = 'finalizado';

								processosExecucao.push(jQuery.extend(true, {}, executandoAgora));

								processosParaExecutar--;
							}
							else if (executandoAgora.jaExecutado % quantum === 0) {

								console.log('Tick', cicloAtual);
								console.log('Processo', executandoAgora.nome, ': executando > preempcao');

								processosExecucao.push(jQuery.extend(true, {}, executandoAgora));
								processosExecucao.push({nome: '_SOBRECARGA_'});

								executandoAgora.estado = 'preempcao';
							}
							else {

								executandoAgora.jaExecutado++;
							}
						}
						else if (executandoAgora.estado === 'preempcao') {

							console.log('Tick', cicloAtual);
							console.log('Processo', executandoAgora.nome, ': preempcao > pronto');

							executandoAgora.estado = 'pronto';

							escalonamentoArray.push(executandoAgora);

							executandoAgora.emEspera++;
						}
					}

					processosArrayCopia.forEach(function (element, index) {

						//console.log('element:', element);

						if ((element.chegada <= cicloAtual)) {

							if (element.estado === 'criado') {

								console.log('Tick', cicloAtual);
								console.log('Processo', element.nome,': criado > pronto');

								element.estado = 'pronto';

								escalonamentoArray.push(element);

								//escalonamentoArray.sort(porTempoExecucao);

								//element.emEspera++;
							}
							else if (element.estado === 'pronto') {

								if (((indexAtual === null) ||
								   ((processosArrayCopia[indexAtual].estado === 'finalizado') ||
								   (processosArrayCopia[indexAtual].estado === 'pronto'))) &&
								   (escalonamentoArray[0].nome === element.nome)) {

									console.log('Tick', cicloAtual);
								   	console.log('Processo', element.nome,': pronto > executando');

									indexAtual = index;

									escalonamentoArray.splice(0, 1);

									element.estado = 'executando';

									element.jaExecutado++;
								}
								else {

									element.emEspera++;
								}
							}	
						}
					});

					cicloAtual++;
				}

				console.log(processosExecucao);

				let tempoMedio = 0,
					processosNomes = [],
					lastExecArray = [];

				processosParaExecutar = processosArray.length;

				processosExecucao.forEach(function (element, index) {

					if ((element.nome !== '_SOBRECARGA_')) {

					    if (processosNomes.indexOf(element.nome) < 0) {

							processosNomes.push(element.nome);
							lastExecArray.push(index);
						}
						else {

							lastExecArray[processosNomes.indexOf(element.nome)] = index;
						}
					}
				});

				//console.log('lastExecArray:', lastExecArray);

				lastExecArray.forEach(function (element) {
					
					tempoMedio += processosExecucao[element].emEspera + processosExecucao[element].jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');

				desenharGraficoExecucao(algoritmo, processosExecucao, tempoMedio);

				processosArrayCopia = clonarArray(processosArray);
			}
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			else if (algoritmo == '4') {

				console.log('Earliest Deadline First!');

				let tempoMedio = 0;

				processosParaExecutar = processosArray.length;

				processosExecucao.forEach(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');
				processosArrayCopia = clonarArray(processosArray);
			}
		}
	});
});