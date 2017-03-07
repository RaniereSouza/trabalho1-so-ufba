$(document).ready(function () {

	let processosArray = []
		quantum = 3,
		ctx = $('#grafico-de-execucao')[0].getContext('2d');

	let scatterChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        datasets: [
			        {
			            label: 'Processo A',
			            borderWidth: 3,
			            borderColor: 'red',
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
			            borderColor: 'blue',
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
			            borderColor: 'lime',
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
		});

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
			                               '<p>Nome: '+ processoObj.nome +'</p>' +
			                               '<p>Chegada: '+ processoObj.chegada +'</p>' +
			                               '<p>Tempo de execução: '+ processoObj.tempoExecucao +'</p>' +
			                               //'<p>Prioridade: '+ processoObj.prioridade +'</p>' +
			                               '<p>Deadline: '+ processoObj.deadline +'</p>' +
			                           '</div>');

		processosArray.push(processoObj);

		e.target.reset();

		console.log(processosArray);
	});



	$('#algoritmo-form').on('submit', function (e) {

		e.preventDefault();

		let processosParaExecutar = processosArray.length,
			processosArrayCopia = processosArray.slice(0); //tentativa de manter o array original intacto para a axecução de outros algoritmos

		let porChegada = function (a, b) {

				return (a.chegada - b.chegada);
			},
			porTempoExecucao = function (a, b) {

				return (a.tempoExecucao - b.tempoExecucao);
			};

		if (processosParaExecutar > 0) {

			let algoritmo = $(e.target).find('#algoritmos').val();

			////////////////////////////////////////////////////////////////////////////////
			if (algoritmo == '1') {

				console.log('First In, First Out!');

				let processosExecucao = processosArrayCopia;

				processosExecucao.sort(porChegada);

				processosExecucao.map(function (element, index) {

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

				processosExecucao.map(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');

				processosArrayCopia = processosArray.slice(0);
			}
			////////////////////////////////////////////////////////////////////////////////
			else if (algoritmo == '2') {

				console.log('Smallest Job First!');

				let escalonamentoArray = [],
					processosExecucao = [],
					cicloAtual = 0,
					indexAtual = null;

				processosArrayCopia.sort(porChegada);

				//processosArrayCopia[0].estado = 'executando';

				//escalonamentoArray.push(processosArrayCopia[1]);

				while (processosParaExecutar > 0) {

					processosArrayCopia.map(function (element, index) {

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
							else if (element.estado === 'executando') {

								if (element.jaExecutado === element.tempoExecucao) {

									console.log('Tick', cicloAtual);
									console.log('Processo', element.nome,': executando > finalizado');

									element.estado = 'finalizado';

									processosExecucao.push(element);

									processosParaExecutar--;
								}
								else {

									element.jaExecutado++;
								}
							}
						}
					});

					cicloAtual++;
				}

				console.log(processosExecucao);

				let tempoMedio = 0;

				processosParaExecutar = processosArray.length;

				processosExecucao.map(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');

				
				processosArrayCopia = processosArray.slice(0);
			}
			////////////////////////////////////////////////////////////////////////////////
			else if (algoritmo == '3') {

				console.log('Round-Robin!');

				let escalonamentoArray = [],
					processosExecucao = [],
					cicloAtual = 0,
					indexAtual = null;

				processosArrayCopia.sort(porChegada);

				//processosArrayCopia[0].estado = 'executando';

				//escalonamentoArray.push(processosArrayCopia[1]);

				while (processosParaExecutar > 0) {

					processosArrayCopia.map(function (element, index) {

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
							else if (element.estado === 'executando') {

								if (element.jaExecutado >= element.tempoExecucao) {

									console.log('Tick', cicloAtual);
									console.log('Processo', element.nome,': executando > finalizado');

									element.estado = 'finalizado';

									processosExecucao.push(jQuery.extend(true, {}, element));

									processosParaExecutar--;
								}
								else if (element.jaExecutado % quantum === 0) {

									console.log('Tick', cicloAtual);
									console.log('Processo', element.nome, ': executando > preempcao');

									processosExecucao.push(jQuery.extend(true, {}, element));
									processosExecucao.push({nome: '_SOBRECARGA_'});

									element.estado = 'preempcao';

									element.emEspera++;
								}
								else {

									element.jaExecutado++;
								}
							}
							else if (element.estado === 'preempcao') {

								console.log('Tick', cicloAtual);
								console.log('Processo', element.nome, ': preempcao > pronto');

								element.estado = 'pronto';

								escalonamentoArray.push(element);
							}
						}
					});

					cicloAtual++;
				}

				console.log(processosExecucao);

				//let tempoMedio = 0;

				processosParaExecutar = processosArray.length;

				/*processosExecucao.map(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');*/

				processosArrayCopia = processosArray.slice(0);
			}
			////////////////////////////////////////////////////////////////////////////////
			else if (algoritmo == '4') {

				console.log('Earliest Deadline First!');

				let tempoMedio = 0;

				processosParaExecutar = processosArray.length;

				processosExecucao.map(function (element) {

					tempoMedio += element.emEspera + element.jaExecutado;
				});

				tempoMedio = tempoMedio/processosParaExecutar;

				console.log('tempo médio:', tempoMedio, 'u.t.');
				processosArrayCopia = processosArray.slice(0);
			}
		}
	});
});