document.addEventListener("DOMContentLoaded", function () {
    const sacolaQuantidade = document.querySelector(".badge");

    // Calcular a quantidade inicial de itens na sacola
    function calcularQuantidadeInicial() {
        return fetch('http://localhost:8080/sacola')
            .then(response => response.json())
            .then(sacolaItens => sacolaItens.length)
            .catch(error => {
                console.error('Erro ao obter itens da sacola:', error);
                return 0;
            });
    }

    // Adicionar item à sacola
    document.querySelectorAll(".btn-adicionar-sacola").forEach((botao) => {
        botao.addEventListener("click", function () {
            const item = {
                nome: this.getAttribute("data-nome"),
                preco: parseFloat(this.getAttribute("data-preco")),
            };

            adicionarItem(item);
        });
    });

    function adicionarItem(item) {
        fetch('http://localhost:8080/sacola/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Item adicionado com sucesso:', data);

                atualizarQuantidadeSacola();

                const itemAdicionadoModal = new bootstrap.Modal(document.getElementById("itemAdicionadoModal"));
                itemAdicionadoModal.show();
            })
            .catch(error => {
                console.error('Erro ao adicionar item:', error);
            });
    }

    atualizarQuantidadeSacola();

    async function atualizarQuantidadeSacola() {
        try {
            const quantidade = await calcularQuantidadeInicial();

            sacolaQuantidade.textContent = quantidade;

            sacolaQuantidade.style.display = quantidade > 0 ? "inline" : "none";
        } catch (error) {
            console.error('Erro ao calcular quantidade inicial:', error);
        }
    }

    // Redirecionar para a página da sacola
    const botaoSacola = document.querySelector(".navbar-btn");
    botaoSacola.addEventListener("click", function () {
        window.location.href = "sacola.html";
    });

    renderizarListaSacola();

    // Renderizar a lista de itens na sacola
    function renderizarListaSacola() {
        fetch('http://localhost:8080/sacola')
            .then(response => response.json())
            .then(sacolaItens => {
                const listaSacola = document.getElementById("lista-sacola");
                const totalSacola = document.getElementById("total-sacola");

                listaSacola.innerHTML = "";

                let total = 0;
                sacolaItens.forEach((item, index) => {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
                    listItem.innerHTML = `
                    <div>
                        ${item.nome}
                    </div>
                    <div>
                        <span class="me-1">R$ ${item.preco.toFixed(2)}</span>
                        <button type="button" class="btn btn-danger btn-remover-item" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5000 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                    </div>
                `;

                    listaSacola.appendChild(listItem);

                    total += item.preco;
                });

                totalSacola.textContent = total.toFixed(2);
            })
            .catch(error => console.error('Erro ao obter a sacola:', error));
    }

    // Remover item da sacola
    document.addEventListener("click", function (event) {
        const removerItemSelector = ".btn-remover-item";
        const botaoRemover = event.target.closest(removerItemSelector);

        if (botaoRemover) {
            const index = parseInt(botaoRemover.getAttribute("data-index"), 10);

            if (!isNaN(index)) {
                fetch(`http://localhost:8080/sacola/remover/${index}`, {
                    method: "DELETE",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("Item removido:", data);
                        renderizarListaSacola();
                    })
                    .catch((error) => {
                        console.error("Erro ao remover item:", error);
                    });
            }
        }

        atualizarQuantidadeSacola();
    });

    // Finalizar pedido
    document.addEventListener("click", async function (event) {
        if (event.target.id === "btn-finalizar") {
            try {
                const response = await fetch('http://localhost:8080/sacola/limpar', {
                    method: 'POST',
                });

                if (response.ok) {
                    renderizarListaSacola();

                    const pedidoFinalizadoModal = new bootstrap.Modal(document.getElementById("pedidoFinalizadoModal"));
                    pedidoFinalizadoModal.show();

                    pedidoFinalizadoModal._element.addEventListener('hidden.bs.modal', function () {
                        window.location.href = "index.html";
                    });
                } else {
                    console.error('Erro ao limpar a sacola:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao finalizar pedido:', error);
            }
        }
    });
})