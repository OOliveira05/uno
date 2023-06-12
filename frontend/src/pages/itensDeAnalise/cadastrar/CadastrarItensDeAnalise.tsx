import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Navbar from "../../../components/navbar/Navbar.tsx";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-tailwindcss-select";

interface CadastrarItensDeAnaliseRequest {
  quantidade: number;
  unidade: string;
  tipoMaterial: string;
  lote: string;
  notaFiscal: string;
  condicao: string;
  observacao: string;
  solicitacaoDeAnaliseId: string;
}

const solicitacoesOptions = [
  { value: "", label: "Selecione a solicitação de análise" },
];

const CadastrarItensDeAnalise = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [solicitacao, setSolicitacao] = useState(solicitacoesOptions[0]);

  const cancelButtonRef = useRef(null);

  const getSolicitacoes = async () => {
    const data = await axios.get(
      "https://uno-production.up.railway.app/solicitacoes-de-analise"
    );

    const solicitacoes = data.data;

    solicitacoes.forEach((solicitacaoDeAnalise: { id: any; nomeProjeto: string; }) => {
      solicitacoesOptions.push({ value: solicitacaoDeAnalise.id, label: solicitacaoDeAnalise.nomeProjeto })
    });

    setLoading(false);
  };

  const changeSolicitacao = (value: any) => {
    setSolicitacao(value);
    formik.setFieldValue("solicitacaoDeAnaliseId", value.value);
  };

  useEffect(() => {
    getSolicitacoes();
  }, []);

  const formik = useFormik({
    initialValues: {
      quantidade: 0,
      unidade: "",
      tipoMaterial: "",
      lote: "",
      notaFiscal: "",
      condicao: "",
      observacao: "",
      solicitacaoDeAnaliseId: "",
    },

    validationSchema: yup.object().shape({
      quantidade: yup.number().required("Campo obrigatório!"),
      unidade: yup.string().required("Campo obrigatório!"),
      tipoMaterial: yup.string().required("Campo obrigatório!"),
      lote: yup.string().required("Campo obrigatório!"),
      notaFiscal: yup.string().required("Campo obrigatório!"),
      condicao: yup.string().required("Campo obrigatório!"),
      observacao: yup.string().required("Campo obrigatório!"),
      solicitacaoDeAnaliseId: yup.string().required("Campo obrigatório!"),
    }),

    onSubmit: async (values: CadastrarItensDeAnaliseRequest) => {
      try {
        console.log("values:", values);
        //yyyy-MM-dd
        await axios.post(
          "https://uno-production.up.railway.app/itens-de-analise",
          values
        );
        setOpen(true);
        setSolicitacao(solicitacoesOptions[0]);
        formik.resetForm();
      } catch (error: any) {
        console.log(error)
      }
    },
  });

  return (
    loading ? (<div></div>) :<div>
    <Navbar />
    <form className="mx-auto w-5/6 my-7" onSubmit={formik.handleSubmit}>
      <div className="space-y-12 ">
        <div className="border-b border-gray-900/10 pb-7">
          <h2 className="text-base font-inter font-semibold leading-7 text-gray-900">
            Cadastrar itens de análise
          </h2>
          <p className="font-inter mt-1 text-sm leading-6 text-gray-600">
            Preencha abaixo cuidadosamente as informações dos itens de análise
          </p>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-12">
        <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="solicitante"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Solicitação de Análise
            </label>
            <div className="mt-2 relative">
            <Select
                onChange={changeSolicitacao}
                value={solicitacao}
                isSearchable={true}
                options={solicitacoesOptions}
                primaryColor="indigo"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="nome"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Tipo de material
            </label>
            <div className="mt-2 relative">
              <input
                onChange={formik.handleChange}
                value={formik.values.tipoMaterial}
                onBlur={formik.handleBlur}
                type="text"
                name="tipoMaterial"
                id="tipoMaterial"
                autoComplete="tipoMaterial"
                className={`${
                  formik.touched.tipoMaterial && formik.errors.tipoMaterial
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 rounded-md shadow-sm ring-1 font-inter ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.tipoMaterial && formik.touched.tipoMaterial
                  ? formik.errors.tipoMaterial
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="cnpj"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Lote
            </label>
            <div className="relative mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.lote}
                onBlur={formik.handleBlur}
                type="text"
                name="lote"
                id="lote"
                autoComplete="lote"
                className={`${
                  formik.touched.lote && formik.errors.lote
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 rounded-md shadow-sm font-inter ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.lote && formik.touched.lote
                  ? formik.errors.lote
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="endereco"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Nota fiscal
            </label>
            <div className="mt-2 relative">
            <input
                onChange={formik.handleChange}
                value={formik.values.notaFiscal}
                onBlur={formik.handleBlur}
                type="text"
                name="notaFiscal"
                id="notaFiscal"
                autoComplete="notaFiscal"
                className={`${
                  formik.touched.notaFiscal && formik.errors.notaFiscal
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 rounded-md shadow-sm font-inter ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.notaFiscal && formik.touched.notaFiscal
                  ? formik.errors.notaFiscal
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="numero"
              className="block font-inter text-sm font-medium leading-6 text-gray-900"
            >
              Quantidade
            </label>
            <div className="mt-2 relative">
            <input
                onChange={formik.handleChange}
                value={formik.values.quantidade}
                onBlur={formik.handleBlur}
                type="number"
                name="quantidade"
                id="quantidade"
                autoComplete="quantidade"
                className={`${
                  formik.touched.quantidade && formik.errors.quantidade
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 rounded-md shadow-sm font-inter ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.quantidade && formik.touched.quantidade
                  ? formik.errors.quantidade
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="cidade"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Unidade
            </label>
            <div className="mt-2 relative">
            <input
                onChange={formik.handleChange}
                value={formik.values.unidade}
                onBlur={formik.handleBlur}
                type="text"
                name="unidade"
                id="unidade"
                autoComplete="unidade"
                className={`${
                  formik.touched.unidade && formik.errors.unidade
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 rounded-md shadow-sm font-inter ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.unidade && formik.touched.unidade
                  ? formik.errors.unidade
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="estado"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Condição
            </label>
            <div className="mt-2 relative">
            <textarea
                rows={5}
                onChange={formik.handleChange}
                value={formik.values.condicao}
                onBlur={formik.handleBlur}
                name="condicao"
                id="condicao"
                autoComplete="condicao"
                className={`${
                  formik.touched.condicao &&
                  formik.errors.condicao
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 font-inter rounded-md shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full resize-none`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.condicao && formik.touched.condicao
                  ? formik.errors.condicao
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="estado"
              className="block text-sm font-medium leading-6 text-gray-900 font-inter"
            >
              Observações
            </label>
            <div className="mt-2 relative">
            <textarea
                rows={5}
                onChange={formik.handleChange}
                value={formik.values.observacao}
                onBlur={formik.handleBlur}
                name="observacao"
                id="observacao"
                autoComplete="observacao"
                className={`${
                  formik.touched.observacao &&
                  formik.errors.observacao
                    ? "focus:ring-red-500 ring-red-500"
                    : "focus:ring-indigo-600"
                } text-sm py-2 px-3 font-inter rounded-md shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset focus:outline-none w-full resize-none`}
              />
              <p className="absolute -top-2 right-6 text-xs text-red-500 bg-white px-2 font-inter">
                {formik.errors.observacao && formik.touched.observacao
                  ? formik.errors.observacao
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-inter"
        >
          Cadastrar
        </button>
      </div>
    </form>

    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-1">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 font-inter"
                      >
                        Itens de análise cadastrados
                      </Dialog.Title>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto font-inter"
                    onClick={() => setOpen(false)}
                  >
                    Ok
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  </div>
  );
};

export default CadastrarItensDeAnalise;
