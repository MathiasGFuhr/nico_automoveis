import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface SalePDFData {
  saleCode: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCpf: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehiclePrice: number
  paymentMethod: string
  saleDate: string
  sellerName: string
  sellerPhone?: string
  commission: number
  notes?: string
  vehiclePlate?: string
  vehicleMileage?: string
  vehicleColor?: string
  vehicleFuel?: string
  vehicleTransmission?: string
  vehicleChassis?: string
  vehicleEngine?: string
}

export class PDFService {
  static async generateSalePDF(saleData: SalePDFData): Promise<void> {
    // Criar elemento temporário para renderizar o PDF
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '-9999px'
    tempDiv.style.width = '210mm'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.padding = '0'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    
    tempDiv.innerHTML = this.generateHTMLContent(saleData)
    document.body.appendChild(tempDiv)

    try {
      // Aguardar carregamento de imagens
      const images = tempDiv.getElementsByTagName('img')
      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map(img => {
            if (img.complete) return Promise.resolve()
            return new Promise((resolve) => {
              img.onload = () => resolve(true)
              img.onerror = () => resolve(false)
              setTimeout(() => resolve(false), 5000)
            })
          })
        )
      }

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Converter HTML para canvas com configurações otimizadas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: false
      })

      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      
      // Calcular dimensões para caber em uma página
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      // Adicionar ao PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // Salvar PDF
      pdf.save(`venda-${saleData.saleCode}.pdf`)
      console.log('✅ PDF gerado com sucesso!')
      
    } finally {
      // Remover elemento temporário
      document.body.removeChild(tempDiv)
    }
  }

  private static generateHTMLContent(saleData: SalePDFData): string {
    const currentDate = new Date().toLocaleDateString('pt-BR')
    const saleDate = new Date(saleData.saleDate).toLocaleDateString('pt-BR')
    
    return `
      <div style="width: 100%; max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; color: #000; background: #fff; border: 2px solid #dc2626; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #dc2626;">
          <h1 style="margin: 10px 0; font-size: 32px; font-weight: bold;">
            <span style="color: #000;">NICO</span>
            <span style="color: #dc2626;">AUTOMÓVEIS</span>
          </h1>
        </div>

        <!-- Título Principal -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #dc2626; font-size: 18px; margin: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">COMPROVANTE DE VENDA DE VEÍCULO</h2>
          <div style="width: 80px; height: 2px; background: #dc2626; margin: 8px auto;"></div>
        </div>

        <!-- Informações da Venda -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 3px solid #dc2626;">
          <h3 style="color: #dc2626; font-size: 14px; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">INFORMAÇÕES DA VENDA</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
            <div>
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">DATA DA VENDA:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleDate}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">VENDEDOR:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.sellerName}</p>
              ${saleData.sellerPhone ? `<p style="color: #666; font-size: 10px; margin: 1px 0 0 0;">Tel: ${saleData.sellerPhone}</p>` : ''}
            </div>
            <div>
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">FORMA DE PAGAMENTO:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.paymentMethod}</p>
            </div>
          </div>
        </div>

        <!-- Conteúdo em Duas Colunas -->
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          
          <!-- Coluna Esquerda - Detalhes do Veículo -->
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #10b981;">
            <h3 style="color: #10b981; font-size: 14px; margin: 0 0 15px 0; font-weight: bold; text-transform: uppercase;">DETALHES DO VEÍCULO</h3>
            
            <div style="margin-bottom: 10px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">VEÍCULO:</p>
              <p style="color: #000; font-size: 12px; margin: 0; font-weight: bold;">${saleData.vehicleBrand} ${saleData.vehicleModel}</p>
            </div>
            
            <div style="margin-bottom: 10px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">ANO/MODELO:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehicleYear}</p>
            </div>
            
            <div style="margin-bottom: 10px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">PLACA:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehiclePlate || 'Não informada'}</p>
            </div>
            
            ${saleData.vehicleMileage ? `
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">QUILOMETRAGEM:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehicleMileage} km</p>
            </div>
            ` : ''}
            
            ${saleData.vehicleColor ? `
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">COR:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehicleColor}</p>
            </div>
            ` : ''}
            
            ${saleData.vehicleFuel ? `
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">COMBUSTÍVEL:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehicleFuel}</p>
            </div>
            ` : ''}
            
            ${saleData.vehicleTransmission ? `
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">TRANSMISSÃO:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehicleTransmission}</p>
            </div>
            ` : ''}
            
            ${saleData.vehicleChassis ? `
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">CHASSI (VIN):</p>
              <p style="color: #000; font-size: 12px; margin: 0; word-break: break-all;">${saleData.vehicleChassis}</p>
            </div>
            ` : ''}
            
            ${saleData.vehicleEngine ? `
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">MOTOR:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.vehicleEngine}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #10b981;">
              <p style="color: #10b981; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">VALOR TOTAL:</p>
              <p style="color: #10b981; font-size: 20px; margin: 0; font-weight: bold;">R$ ${saleData.vehiclePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          
          <!-- Coluna Direita - Informações do Cliente -->
          <div style="flex: 1; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #3b82f6; font-size: 16px; margin: 0 0 20px 0; font-weight: bold; text-transform: uppercase;">DADOS DO COMPRADOR</h3>
            
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">NOME:</p>
              <p style="color: #000; font-size: 16px; margin: 0; font-weight: bold;">${saleData.clientName}</p>
            </div>
            
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">EMAIL:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.clientEmail}</p>
            </div>
            
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">TELEFONE:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.clientPhone}</p>
            </div>
            
            <div style="margin-bottom: 8px;">
              <p style="color: #666; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">CPF:</p>
              <p style="color: #000; font-size: 12px; margin: 0;">${saleData.clientCpf}</p>
            </div>
            
          </div>
        </div>

        <!-- Observações -->
        ${saleData.notes ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 3px solid #f59e0b;">
          <h3 style="color: #f59e0b; font-size: 14px; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">OBSERVAÇÕES</h3>
          <p style="color: #000; font-size: 11px; margin: 0; line-height: 1.4;">${saleData.notes}</p>
        </div>
        ` : ''}

        <!-- Termos e Condições -->
        <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #374151; font-size: 14px; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">TERMOS E CONDIÇÕES</h3>
          <div style="font-size: 11px; color: #4b5563; line-height: 1.4;">
            <p style="margin: 0 0 10px 0;"><strong>1.</strong> O veículo é vendido no estado em que se encontra, sem garantia expressa ou implícita.</p>
            <p style="margin: 0 0 10px 0;"><strong>2.</strong> A transferência de propriedade deve ser realizada no prazo de 30 dias.</p>
            <p style="margin: 0 0 10px 0;"><strong>3.</strong> O comprador é responsável por toda documentação necessária.</p>
            <p style="margin: 0;"><strong>4.</strong> Este documento serve como comprovante oficial da transação.</p>
          </div>
        </div>

        <!-- Assinaturas -->
        <div style="margin-top: 25px;">
          <div style="display: flex; justify-content: space-between; gap: 20px;">
            <div style="text-align: center; border: 2px solid #dc2626; padding: 15px; flex: 1; border-radius: 6px;">
              <p style="color: #dc2626; font-size: 12px; margin: 0 0 15px 0; font-weight: bold; text-transform: uppercase;">ASSINATURA DO COMPRADOR</p>
              <div style="border-bottom: 2px solid #dc2626; margin-bottom: 8px; height: 30px;"></div>
              <p style="color: #666; font-size: 11px; margin: 0;">Data: _______________</p>
            </div>
            
            <div style="text-align: center; border: 2px solid #dc2626; padding: 15px; flex: 1; border-radius: 6px;">
              <p style="color: #dc2626; font-size: 12px; margin: 0 0 15px 0; font-weight: bold; text-transform: uppercase;">ASSINATURA DO VENDEDOR</p>
              <div style="border-bottom: 2px solid #dc2626; margin-bottom: 8px; height: 30px;"></div>
              <p style="color: #666; font-size: 11px; margin: 0;">Data: _______________</p>
            </div>
          </div>
        </div>

        <!-- Rodapé -->
        <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 2px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 11px; margin: 0;">Documento gerado automaticamente em ${currentDate}</p>
          <p style="color: #9ca3af; font-size: 10px; margin: 3px 0 0 0;">Nico Automóveis - Excelência em Veículos</p>
        </div>
      </div>
    `
  }
}