import {
  BeakerIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../../../components/navbar/Navbar.tsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSolicitacoes } from "../../../features/solicitacoes/solicitacoesSlice.ts";
import axios from "axios";
import ItemLista from "../../../components/itemLista/ItemLista.tsx";
import Paginacao from "../../../components/paginacao/Paginacao.tsx";
import { setSolicitacoes } from "../../../features/solicitacoes/solicitacoesSlice.ts";
import Tabela from "../../../components/tabela/Tabela.tsx";

interface SolicitacoesState {
  id: string;
  nomeProjeto: string;
  aberturaSA: Date;
  inicioDoProjeto: Date | null;
  entradaDosMateriais: Date | null;
  conclusaoDoProjeto: Date | null;
  prazoAcoradado: Date;
  tipoDeAnalise: string;
  descricaoDosServicos: string;
  informacoesAdicionais: string;
  modoEnvioResultado: string;
  dataEnvioResultados: Date | null;
  responsavelPeloEnvio: string;
}

const keyMap: Record<string, string> = {
  Desenvolvimento: "Desenvolvimento",
  Degradacao_Forcada: "Degradação Forçada",
  Validacao: "Validação",
  Controle: "Controle",
  Solubilidade: "Solubilidade",
  Estabilidade: "Estabilidade",
  Perfil_de_Dissolucao: "Perfil de Dissolução",
  Solventes_Residuais: "Solventes Residuais",
  Sumario_de_Validacao: "Sumário de Validação",
};

const ConsultarSolicitacaoDeAnalise = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const solicitacoes = useSelector(selectSolicitacoes);
  const dados: any = [];

  solicitacoes &&
    solicitacoes.map((solicitacao: any) => {
      dados.push({
        id: solicitacao.id,
        itemRota: solicitacao.id,
        nome: solicitacao.nomeProjeto,
        info1: solicitacao.Solicitante.nome,
        info2: keyMap[solicitacao.tipoDeAnalise],
      });
    });

  const getSolicitacoes = async () => {
    const response = await axios.get(
      "https://uno-production.up.railway.app/solicitacoes-de-analise"
    );
    dispatch(setSolicitacoes({ solicitacoes: response.data }));
    setLoading(false);
  };

  useEffect(() => {
    getSolicitacoes();
  }, []);

  return loading ? (
    <div></div>
  ) : (
    <div className="min-h-screen">
      <Navbar />

      <div className="w-5/6 mx-auto">
        <Tabela
          dados={dados}
          titulo="Solicitações de Análise"
          textoPesquisa="Pesquisar Solicitação de Análise"
          colunas={["Id", "Nome do Projeto", "Solicitante", "Tipo de Análise"]}
          consultarRota="/solicitacoes-de-analise"
        />
      </div>
    </div>
  );
};

export default ConsultarSolicitacaoDeAnalise;
