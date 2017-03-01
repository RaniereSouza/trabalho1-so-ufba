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
					//processosExecucao = [],
					cicloAtual = 0,
					indexAtual = 0;

				processosArrayCopia.sort(function (a, b) {

					return (a.chegada - b.chegada);
				});

				processosArrayCopia[0].estado = 'executando';

				while (processosParaExecutar > 0) {

					processosArrayCopia.map(function (e, index) {

						let element = e;

						if ((element.chegada <= cicloAtual) &&
						   (element.estado !== 'finalizado')) {

							if (element.estado === 'pronto') {

								element.emEspera++;
							}
							else if () {

								element.jaExecutado++;

								if (element.jaExecutado === element.tempoExecucao) {

									element.estado = 'finalizado';

									processosParaExecutar--;
								}
							}
						}
					});

					cicloAtual++;
				}
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