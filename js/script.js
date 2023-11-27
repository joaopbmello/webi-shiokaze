document.addEventListener("DOMContentLoaded", function () {
    const sacolaQuantidade = document.querySelector(".badge");

    // Calcular a quantidade inicial de itens na sacola
    function calcularQuantidadeInicial() {
        const sacolaItens = JSON.parse(localStorage.getItem("sacola")) || [];
        return sacolaItens.length;
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
        let sacolaItens = JSON.parse(localStorage.getItem("sacola")) || [];
        sacolaItens.push(item);

        localStorage.setItem("sacola", JSON.stringify(sacolaItens));

        atualizarQuantidadeSacola();

        const itemAdicionadoModal = new bootstrap.Modal(document.getElementById("itemAdicionadoModal"));
        itemAdicionadoModal.show();
    }

    atualizarQuantidadeSacola();

    // Detectar mudanças no armazenamento local
    window.addEventListener("storage", function () {
        atualizarQuantidadeSacola();
    });

    // Atualizar a quantidade de itens na sacola no ícone
    function atualizarQuantidadeSacola() {
        const quantidade = calcularQuantidadeInicial();

        sacolaQuantidade.textContent = quantidade;

        sacolaQuantidade.style.display = quantidade > 0 ? "inline" : "none";
    }

    // Redirecionar para a página da sacola
    const botaoSacola = document.querySelector(".navbar-btn");
    botaoSacola.addEventListener("click", function () {
        window.location.href = "sacola.html";
    });

    renderizarListaSacola();

    // Renderizar a lista de itens na sacola
    function renderizarListaSacola() {
        const listaSacola = document.getElementById("lista-sacola");
        const totalSacola = document.getElementById("total-sacola");

        const sacolaItens = JSON.parse(localStorage.getItem("sacola")) || [];

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
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </button>
            </div>
        `;

            listaSacola.appendChild(listItem);

            total += item.preco;
        });

        totalSacola.textContent = total.toFixed(2);

        // Remover itens da sacola
        document.querySelectorAll(".btn-remover-item").forEach((botao) => {
            botao.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-index"), 10);

                sacolaItens.splice(index, 1);

                localStorage.setItem("sacola", JSON.stringify(sacolaItens));

                atualizarQuantidadeSacola();

                renderizarListaSacola();
            });
        });
    }

    // Finalizar pedido
    document.addEventListener("click", function (event) {
        if (event.target.id === "btn-finalizar") {
            localStorage.removeItem("sacola");

            atualizarQuantidadeSacola();

            const pedidoFinalizadoModal = new bootstrap.Modal(document.getElementById("pedidoFinalizadoModal"));
            pedidoFinalizadoModal.show();

            pedidoFinalizadoModal._element.addEventListener('hidden.bs.modal', function () {
                window.location.href = "index.html";
            });
        }
    });
});