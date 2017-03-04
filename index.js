$(document).ready(function () {

	let processosArray = [];

	$('.header-title').text('Trabalho de SO - Escalonamento de Processos');

	$('#processo-form').on('submit', function (e) {

		e.preventDefault();

		let processoObj = {
				nome: $(e.target).find('#nome').val(),
				chegada: Number($(e.target).find('#chegada').val()),
				tempoExecucao: Number($(e.target).find('#tempoExecucao').val()),
				jaExecutado: 0,
				emEspera: 0,
				estado: 'criado',
				prioridade: Number($(e.target).find('#prioridade').val()),
				deadline: Number($(e.target).find('#deadline').val()),
			};

		$('#fila-de-processos').append('<div class="processo-wrapper">' +
			                               '<p>Nome: '+ processoObj.nome +'</p>' +
			                               '<p>Chegada: '+ processoObj.chegada +'</p>' +
			                               '<p>Tempo de execução: '+ processoObj.tempoExecucao +'</p>' +
			                               '<p>Prioridade: '+ processoObj.prioridade +'</p>' +
			                               '<p>Deadline: '+ processoObj.deadline +'</p>' +
			                           '</div>');

		processosArray.push(processoObj);

		e.target.reset();

		console.log(processosArray);
	});

	$('#algoritmo-form').on('submit', function (e) {

		e.preventDefault();

		let processosParaExecutar = processosArray.length,
			processosArrayCopia = processosArray; //tentativa de manter o array original intacto para a axecução de outros algoritmos

		if (processosParaExecutar > 0) {

			let algoritmo = $(e.target).find('#algoritmos').val();

			if (algoritmo == '1') {

				console.log('First In, First Out!');

				processosArrayCopia.sort(function (a, b) {

					return (a.chegada - b.chegada);
				});

				let processosExecucao = processosArrayCopia.map(function (e, index) {

											let element = e;

											element.jaExecutado = element.tempoExecucao;

											if (index > 0) {

												element.emEspera = (processosArrayCopia[index - 1].chegada +
																   processosArrayCopia[index - 1].tempoExecucao) -
																   element.chegada; 
											}

											element.estado = 'finalizado';

											return element;
						 				});

				console.log(processosExecucao);
			}
			else if (algoritmo == '2') {

				console.log('Smallest Job First!');

				let escalonamentoArray = [],
					processosExecucao = [],
					cicloAtual = 0,
					indexAtual = null;

				processosArrayCopia.sort(function (a, b) {

					return (a.chegada - b.chegada);
				});

				//processosArrayCopia[0].estado = 'executando';

				let porTempoExecucao = function (a, b) {

						return (a.tempoExecucao - b.tempoExecucao);
					};

				//escalonamentoArray.push(processosArrayCopia[1]);

				while (processosParaExecutar > 0) {

					processosArrayCopia.map(function (element, index) {

						if ((element.chegada <= cicloAtual)) {

							if (element.estado === 'criado') {

								element.estado = 'pronto';

								escalonamentoArray.push(element);

								escalonamentoArray.sort(porTempoExecucao);

								//element.emEspera++;
							}
							else if (element.estado === 'pronto') {

								if (((indexAtual === null) ||
								   (processosArrayCopia[indexAtual].estado === 'finalizado')) &&
								   (escalonamentoArray[0].nome === element.nome)) {

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
			}
			else if (algoritmo == '3') {

				console.log('Round-Robin!');
			}
			else if (algoritmo == '4') {

				console.log('Earliest Job First!');
			}
		}
	});
});