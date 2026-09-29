import { Link } from 'react-router-dom';
import { ArrowLeft, PawPrint, ShieldCheck } from 'lucide-react';

const policySections = [
  ['1. Apresentação', 'Esta Política explica como o Animal Place trata dados pessoais quando você acessa ou utiliza animalplace.com.br, o aplicativo, áreas autenticadas, formulários, canais de atendimento, funcionalidades, APIs e demais serviços digitais que indiquem sua aplicação. O tratamento compreende coleta, acesso, utilização, armazenamento, compartilhamento e eliminação. Este documento não substitui termos de uso, Declaração de Cookies ou avisos específicos. O acesso a esta Política não representa consentimento. Buscamos observar os princípios da Lei nº 13.709/2018 (LGPD); quando o consentimento for necessário, ele será solicitado antes do tratamento.'],
  ['2. Quem é o controlador', 'Controlador: Animal Place Pet Shop Ltda. Nome fantasia: Animal Place. CNPJ: 07.929.176/0001-71. Endereço: Avenida do Anastácio, 1831, Parque São Domingos, São Paulo/SP, Brasil. E-mail geral: administrativo@animalplace.com.br. E-mail de privacidade: [privacidade@animalplace.com.br]. Canal de direitos: [URL do formulário ou e-mail]. Encarregado: [nome completo ou nome empresarial]. Contato: [e-mail/endereço/formulário]. Se houver mais de um controlador, sua atuação será informada no fluxo correspondente.'],
  ['3. Quem são os titulares abrangidos', 'A Política pode se aplicar a visitantes, usuários do aplicativo, titulares de contas, tutores ou responsáveis por animais, pessoas que enviem solicitações ou conteúdo, anunciantes, profissionais, estabelecimentos, parceiros, destinatários de comunicações e pessoas cujos dados sejam legitimamente incluídos por usuários. Quem fornecer dados de terceiros deve ter autorização ou outra base jurídica e informar a pessoa quando necessário.'],
  ['4. Quais dados pessoais podemos tratar', 'Tratamos somente dados necessários às finalidades. Categorias: identificação (nome, usuário, CPF ou identificador); contato (e-mail, telefone, endereço e cidade); conta (identificador, preferências, histórico e configurações); autenticação e segurança (credenciais, tokens, IP, datas e eventos); navegação (dispositivo, navegador, páginas, origem, duração e eventos); localização aproximada ou precisa; dados do animal (nome, espécie, características, fotos e informações fornecidas); conteúdo (mensagens, comentários, anúncios, fotos, vídeos e anexos); preferências e consentimentos; dados de transação quando houver pagamentos; e dados profissionais ou comerciais quando aplicável. A origem, finalidade e obrigatoriedade variam conforme a funcionalidade. Cookies opcionais dependem da escolha do titular quando aplicável.'],
  ['4.1 Dados inseridos em campos livres', 'Evite inserir dados excessivos ou sensíveis que não sejam necessários. Podemos restringir, ocultar ou eliminar conteúdo que exponha dados indevidamente, especialmente documentos, informações financeiras, credenciais, dados de saúde humana ou dados de crianças.'],
  ['4.2 Dados relativos a animais', 'Informações exclusivamente sobre um animal não são, por si só, dados pessoais. Podem se tornar dados pessoais quando vinculadas a tutor identificável, conta, endereço, telefone, localização, foto ou histórico; nesse caso, serão tratadas conforme esta Política.'],
  ['4.3 Dados pessoais sensíveis', 'Como regra, não solicitamos dados sensíveis. Se fornecidos voluntariamente, poderão ser tratados somente quando necessários e com hipótese legal adequada. Não envie dados sensíveis em campos que não os solicitem.'],
  ['5. Fontes dos dados', 'Podemos obter dados diretamente do titular; automaticamente por logs, cookies e tecnologias semelhantes; de representante autorizado; de prestadores ou parceiros quando necessário e permitido; de fontes públicas ou autoridades para finalidade legítima; e de informações geradas pelo uso dos serviços, como preferências, acessos e eventos de segurança.'],
  ['6. Finalidades e bases legais', 'As finalidades incluem administrar e proteger contas; disponibilizar funcionalidades; responder solicitações; enviar comunicações; realizar marketing; medir audiência; personalizar e melhorar os serviços; prevenir fraude e abuso; cumprir obrigações; exercer direitos; gerenciar parceiros; e processar pagamentos quando houver. Conforme o tratamento concreto, as bases podem incluir execução de contrato ou procedimentos preliminares, consentimento, legítimo interesse após avaliação, obrigação legal ou regulatória, exercício regular de direitos e prevenção à fraude e segurança. O responsável deve confirmar as bases de cada fluxo antes da publicação. Finalidade nova e incompatível exige atualização e, quando necessário, nova informação ou consentimento.'],
  ['7. Dados obrigatórios e facultativos', 'Indicaremos quando um dado for necessário. A recusa de dados necessários pode impedir cadastro, funcionalidade ou atendimento. A recusa de dados facultativos para marketing, personalização ou cookies opcionais não deve impedir funcionalidades essenciais, salvo justificativa informada.'],
  ['8. Consentimento, escolhas e revogação', 'Quando necessário, o consentimento será específico, sem autorizações genéricas. Pode ser recusado ou revogado gratuitamente e por procedimento facilitado. A revogação não afeta tratamentos anteriores; a eliminação observará hipóteses legais de conservação. Preferências: [link do centro de preferências] ou [link de descadastro].'],
  ['9. Cookies e tecnologias semelhantes', 'Podemos usar cookies, pixels, SDKs, tags e armazenamento local para funcionamento, segurança, preferências, métricas, personalização e publicidade. Categorias: estritamente necessários; preferências; analíticos/desempenho; multimídia/funcionais; e publicidade/marketing. Cookies não necessários serão ativados somente após escolha válida quando exigido. O titular poderá aceitar, rejeitar, personalizar e alterar escolhas. Inventário: Declaração de Cookies em [link permanente]; centro de preferências: [link ou ícone persistente]. Bloquear cookies necessários pode afetar o serviço; rejeitar opcionais não deve impedir funcionalidades essenciais.'],
  ['10. Publicidade, analytics e serviços incorporados', 'Ferramentas de análise, publicidade, mensageria, mapas, autenticação, vídeos, captcha, suporte, pagamentos e hospedagem poderão ser utilizadas para finalidades específicas, com os dados necessários. Antes da publicação, preencher [link da Lista de Parceiros] com fornecedor, serviço, papel jurídico, dados, finalidade, país de tratamento e política pertinente.'],
  ['11. Compartilhamento de dados pessoais', 'Podemos compartilhar, conforme finalidade, necessidade e base legal, com fornecedores de hospedagem, armazenamento, segurança e suporte; e-mail, SMS e atendimento; pagamentos e antifraude; analytics e publicidade conforme escolhas; parceiros necessários; autoridades diante de obrigação ou requisição válida; empresas do grupo quando aplicável; e envolvidos em reorganização societária. Não comercializamos dados pessoais. Contratos com operadores devem prever instruções, confidencialidade, segurança, limitação de finalidade e eliminação/devolução quando aplicável.'],
  ['12. Transferências internacionais', 'Alguns fornecedores podem estar fora do Brasil ou permitir acesso internacional. A Lista de Parceiros deve identificar destinatário, papel, dados, finalidade, país e mecanismo jurídico. Transferências somente ocorrerão com base legal e mecanismo permitido pela LGPD e regulamentação da ANPD.'],
  ['13. Retenção, eliminação e anonimização', 'Os dados serão mantidos pelo tempo necessário às finalidades, obrigações, auditorias, prevenção a fraude e exercício de direitos. Ao final, serão eliminados, anonimizados ou conservados em hipótese legal. Backups e registros de segurança podem permanecer por prazo adicional justificado e com acesso restrito. Prazos a preencher conforme o inventário: conta [prazo após encerramento]; atendimento [prazo]; marketing [até revogação, descadastro ou inatividade]; cookies [Declaração de Cookies]; logs [prazo legal/segurança]; transações [prazo legal, regulatório e contábil]; incidentes [prazo aplicável]. Quando a eliminação não for possível, o uso será limitado.'],
  ['14. Conteúdo público e conteúdo gerado pelo usuário', 'Quando uma funcionalidade permitir publicações, o nível de visibilidade será informado. O usuário deve evitar publicar dados desnecessários ou de terceiros sem autorização. Podemos moderar, ocultar ou remover conteúdo ilegal, inseguro ou que viole direitos. Pedidos: [link/canal de denúncia e privacidade].'],
  ['15. Crianças e adolescentes', 'O uso observará as regras da funcionalidade e supervisão legal quando aplicável. Tratamentos considerarão melhor interesse, coleta mínima, transparência e consentimento específico do responsável quando exigido. Diante de coleta indevida, adotaremos medidas de bloqueio ou eliminação, ressalvadas hipóteses legais. Canal: [canal de privacidade].'],
  ['16. Localização', 'Quando utilizada, informaremos se é aproximada ou precisa, finalidade, frequência, armazenamento e como desativá-la. Localização precisa não será coletada continuamente sem necessidade e informação adequada. Permissões podem ser alteradas no dispositivo, limitando a funcionalidade.'],
  ['17. Decisões automatizadas e criação de perfis', '[Selecionar e manter apenas uma alternativa.] A: O Animal Place não toma decisões unicamente automatizadas que produzam efeitos jurídicos ou afetem significativamente interesses do titular. B: Podemos usar tratamento automatizado para [finalidade]; critérios: [descrever]; efeitos: [descrever]. Solicitações de informação ou revisão: [canal].'],
  ['18. Segurança da informação', 'Adotamos medidas técnicas e administrativas proporcionais aos riscos, como controles de acesso, autenticação, proteção de comunicações e credenciais, segregação de ambientes, monitoramento, backups, gestão de vulnerabilidades e fornecedores, treinamento e procedimentos de resposta e remediação. Nenhum sistema é absolutamente imune a falhas; isso não exclui deveres legais nem medidas adequadas.'],
  ['19. Incidentes de segurança', 'Mantemos procedimento para identificar, conter, investigar, documentar, remediar e comunicar incidentes. Quando houver risco ou dano relevante, as comunicações à ANPD e aos titulares observarão prazos e regras aplicáveis. Registros serão mantidos pelo período devido. Para comunicar suspeita: [canal de segurança/privacidade]. Não envie senhas por e-mail comum.'],
  ['20. Direitos dos titulares', 'Nos termos da LGPD, o titular pode solicitar confirmação e acesso; correção; anonimização, bloqueio ou eliminação; portabilidade; informação sobre compartilhamentos e consequências de não consentir; eliminação de dados tratados com consentimento, ressalvadas hipóteses legais; revogação; oposição quando cabível; revisão de decisões automatizadas quando aplicável; e petição perante a ANPD. O exercício é gratuito: [link do formulário] ou [e-mail de privacidade], assunto “Direitos do titular”. Poderemos confirmar identidade de forma proporcional, nunca solicitar senha por e-mail. Pedidos serão atendidos nos prazos legais; eventual impossibilidade será justificada. Quando exigido, comunicaremos providências aos destinatários dos dados.'],
  ['21. Encarregado e canal de privacidade', 'Encarregado: [nome completo ou nome empresarial]. E-mail: [e-mail]. Endereço: [endereço]. Substituto: [nome e contato]. Se houver dispensa válida de indicação: canal [e-mail ou formulário], responsável [nome/setor], triagem [prazo]. Porte, risco e necessidade de encarregado devem ser avaliados; eventual dispensa não elimina as demais obrigações da LGPD.'],
  ['22. Links e serviços externos', 'Links externos sujeitam o titular às práticas do terceiro e não significam endosso ou controle pelo Animal Place. Ferramentas incorporadas que tratem dados durante o uso serão descritas nesta Política, na Declaração de Cookies ou em aviso específico.'],
  ['23. Alterações desta Política', 'A versão vigente ficará em [URL permanente] e o histórico em [link do histórico ou local]. Alterações relevantes serão comunicadas antes de produzirem efeitos quando exigido. Se uma alteração exigir novo consentimento, o titular poderá recusá-lo ou revogá-lo. Histórico: [1.0], [data], primeira versão consolidada.'],
  ['24. Legislação aplicável', 'Esta Política é interpretada conforme a legislação brasileira, especialmente a LGPD, o Marco Civil da Internet, normas de defesa do consumidor quando incidentes, regulamentações da ANPD e demais normas pertinentes.'],
  ['25. Contato', 'Animal Place Pet Shop Ltda. CNPJ: 07.929.176/0001-71. E-mail de privacidade: [e-mail]. Canal de direitos: [link/e-mail]. Endereço: Avenida do Anastácio, 1831, Parque São Domingos, São Paulo/SP. Encarregado: [nome e contato, quando aplicável].'],
  ['Anexo I — Declaração de Cookies', 'Preencher após varredura real do site e aplicativo; não publicar campos fictícios. Informar categorias (necessários, preferências, analytics, publicidade e multimídia/terceiros), finalidade, possibilidade de desativação, base legal, nome, provedor, duração e país. Preferências: [link]. O titular pode alterar escolhas no centro de preferências ou no navegador; bloquear cookies necessários pode prejudicar o serviço.'],
  ['Anexo II — Parceiros e agentes de tratamento', 'Para cada fornecedor, informar entidade, serviço, papel, dados acessados, finalidade, país/região e link da política. Considerar hospedagem/cloud, e-mail/mensageria, analytics, publicidade e pagamentos/antifraude, somente quando utilizados.'],
  ['Anexo III — Fluxo de exercício de direitos', 'Registrar pedido e data; identificar sistemas envolvidos; confirmar identidade proporcionalmente; analisar dados, base legal, compartilhamentos e retenção; executar a providência ou justificar impossibilidade; comunicar terceiros quando exigido; responder gratuitamente e nos prazos aplicáveis; e arquivar análise e evidência da resposta.'],
  ['Anexo IV — Controles internos recomendados', 'Manter, conforme porte e risco: registro das operações; inventário de cookies e integrações; contratos com operadores; políticas de retenção, eliminação e segurança; gestão de acessos; canal e rotina de direitos; plano de incidentes; avaliação de riscos e relatório de impacto quando necessário; treinamento; histórico de versões; e revisão após mudanças de finalidade, fornecedor, tecnologia ou país.']
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#f6f8f2] text-[#20251b]">
      <header className="border-b border-[#e5e9df] bg-white">
        <div className="flex items-center justify-between w-full max-w-6xl px-5 py-5 mx-auto sm:px-8">
          <Link to="/register" className="flex items-center gap-3" aria-label="AnimalPlace, voltar ao cadastro">
            <PawPrint className="h-8 w-8 text-[#78a92d]" aria-hidden="true" />
            <span className="text-xl font-bold font-space-grotesk">AnimalPlace</span>
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4c5b3b] transition-colors hover:text-[#78a92d]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar ao cadastro
          </Link>
        </div>
      </header>

      <div className="w-full max-w-4xl px-5 py-12 mx-auto sm:px-8 sm:py-16">
        <div className="mb-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#668a35]">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          Privacidade e transparência
        </div>

        <h1 className="text-4xl font-bold leading-tight font-space-grotesk sm:text-5xl">
          Política de Privacidade
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#62695c]">
          Animal Place Pet Shop Ltda. · Versão [1.0] · Publicação e vigência: [dia/mês/ano]
        </p>

        <aside className="mt-8 border-l-4 border-[#d5943b] bg-[#fff8eb] px-5 py-4 text-sm leading-6 text-[#665337]" aria-label="Aviso de revisão">
          <strong className="font-semibold">Minuta para revisão.</strong> Os campos entre colchetes devem ser preenchidos ou confirmados pelo responsável antes da publicação definitiva. Confirme também se fornecedores, dados, cookies e práticas descritos correspondem à operação real.
        </aside>

        <nav className="mt-10 border-y border-[#dfe5d7] py-6" aria-label="Índice da política">
          <h2 className="mb-4 text-lg font-semibold font-space-grotesk">Nesta política</h2>
          <ol className="grid text-sm gap-x-8 gap-y-2 sm:grid-cols-2">
            {policySections.map(([title], index) => (
              <li key={title}>
                <a className="text-[#536c34] hover:underline" href={`#policy-section-${index + 1}`}>
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="divide-y divide-[#e5e9df]">
          {policySections.map(([title, content], index) => (
            <section className="scroll-mt-8 py-7" id={`policy-section-${index + 1}`} key={title}>
              <h2 className="text-xl font-semibold leading-snug font-space-grotesk sm:text-2xl">{title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#4f5649]">{content}</p>
            </section>
          ))}
        </article>

        <footer className="mt-12 border-t border-[#dfe5d7] pt-6 text-sm text-[#737a6d]">
          <p>Última atualização: 28/09/2026</p>
        </footer>d
      </div>
    </main>
  );
}