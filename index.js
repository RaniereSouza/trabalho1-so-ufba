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

	function corRandom () {

		let len = arrayDeCores.length;

		return arrayDeCores[Math.floor(Math.random() * len)]; 
	}

	/*let myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        datasets: [
			        {
			            label: 'Processo A',
			            borderWidth: 3,
			            borderColor: corRandom(),
			            fill: true,
			            data: [{
			                x: 0,
			                y: 1
			            }, {
			                x: 7,
			                y: 1
			            }]
			        },
			        {
			            label: 'Processo B',
			            borderWidth: 3,
			            borderColor: corRandom(),
			            fill: true,
			            data: [
			            NaN,
			            {
			                x: 7,
			                y: 2
			            }, {
			                x: 12,
			                y: 2
			            }]
			        },
			        {
			            label: 'Processo C',
			            borderWidth: 3,
			            borderColor: corRandom(),
			            fill: true,
			            data: [
			            NaN,
			            {
			                x: 12,
			                y: 3
			            }, {
			                x: 15,
			                y: 3
			            }]
			        },
			        {
			            label: 'Tempo de Espera',
			            borderWidth: 3,
			            borderColor: 'gray',
			            fill: false,
			            data: [
			            NaN,
			            {
			                x: 2,
			                y: 2
			            }, {
			                x: 7,
			                y: 2
			            },
			            NaN,
			            {
			            	x: 5,
			            	y: 3
			            }, {
			            	x: 12,
			            	y: 3
			            }]
			        },
		        ]
		    },
		    options: {
		    	title: {
		    		display: true,
		    		fontSize: 21,
		    		fontColor: '#111',
		    		text: 'Gráfico de Execução - FIFO'
		    	},
		        scales: {
		            xAxes: [{
		                type: 'linear',
		                position: 'bottom'
		            }],
		            yAxes: [{
		            	ticks: {
		            		beginAtZero: true
		            	}
		            }]
		        },
		        layout: {
		        	padding: 15
		        }
		    }
		});*/



	function clonarArray (array) {

		let result = array.map(function (element) {

				return 	jQuery.extend(true, {}, element);
			});

		return result;
	}



	function desenharGraficoExecucao (algoritmo, arrayExecucao) {

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
		                position: 'bottom'
		            }],
		            yAxes: [{
		            	ticks: {
		            		beginAtZero: true
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

			options.title.text = 'Gráfico de Execução - FIFO';

			arrayExecucao.forEach(function (element, index) {
				
				let execObj = {
						label: 'Processo ' + element.nome,
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

			myChart = new Chart(ctx, chartObj);
		}
		else if (algoritmo == '2') {

			options.title.text = 'Gráfico de Execução - SJF';

			arrayExecucao.forEach(function (element, index) {
				
				let execObj = {
						label: 'Processo ' + element.nome,
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

			myChart = new Chart(ctx, chartObj);
		}
		else if (algoritmo == '3') {

			options.title.text = 'Gráfico de Execução - RR';

			let nomesProcessos = [],
				execObjProcessos = [];

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
				            data: []
						});

						yProcesso = nomesProcessos.length;
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
				}
				else {
					
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

			console.log('execObjProcessos:', execObjProcessos);

			datasets = execObjProcessos;

			//datasets.push(tempoEspera);
			datasets.push(preempcao);

			chartObj.data.datasets = datasets;
			chartObj.options = options;

			console.log('chartObj:', chartObj);

			myChart = new Chart(ctx, chartObj);
		}
		else if (algoritmo == '4') {

			options.title.text = 'Gráfico de Execução - EDF';
		}
	}



	$('.header-title').text('Trabalho de SO - Escalonamento de Processos');



	$('#quantum-form').on('submit', function (e) {

		e.preventDefault();

		quantum = Number($(e.target).find('#quantum').val());
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

			////////////////////////////////////////////////////////////////////////////////
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

				desenharGraficoExecucao(algoritmo, processosExecucao);

				processosArrayCopia = clonarArray(processosArray);
			}
			////////////////////////////////////////////////////////////////////////////////
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

				desenharGraficoExecucao(algoritmo, processosExecucao);
				
				processosArrayCopia = clonarArray(processosArray);
			}
			////////////////////////////////////////////////////////////////////////////////
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

				//let tempoMedio = 0;

				processosParaExecutar = processosArray.length;

				/*processosExecucao.forEach(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');*/

				desenharGraficoExecucao(algoritmo, processosExecucao);

				processosArrayCopia = clonarArray(processosArray);
			}
			////////////////////////////////////////////////////////////////////////////////
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