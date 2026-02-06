
import { ComponentType } from '../types';
import { GoogleGenAI } from "@google/genai";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface DetectedSource {
  type: 'google_sheets' | 'airtable' | 'postgres' | 'stripe' | 'csv' | 'json' | 'excel' | 'image' | 'unknown';
  label: string;
  data?: any[];
  hints?: {
    suggestedLayout?: string;
    metrics?: string[];
    dimensions?: string[];
    schema?: Record<string, string>;
  };
}

export class DataDetective {
  static async detect(input: string | File): Promise<DetectedSource> {
    if (typeof input !== 'string') {
      const extension = input.name.split('.').pop()?.toLowerCase();
      
      if (['png', 'jpg', 'jpeg', 'webp'].includes(extension || '')) {
        return await this.analyzeImage(input);
      }

      if (extension === 'csv') return await this.parseCSV(input);
      if (extension === 'json') return await this.parseJSON(input);
      if (extension === 'xlsx' || extension === 'xls') return await this.parseExcel(input);

      return { type: 'unknown', label: input.name };
    }

    // URL Detection logic remains as backup
    if (input.includes('docs.google.com/spreadsheets')) return { type: 'google_sheets', label: 'Google Sheets' };
    if (input.includes('airtable.com')) return { type: 'airtable', label: 'Airtable' };
    
    return { type: 'unknown', label: 'Natural Language Query' };
  }

  private static inferSchema(data: any[]): DetectedSource['hints'] {
    if (!data || data.length === 0) return {};
    const firstRow = data[0];
    const metrics: string[] = [];
    const dimensions: string[] = [];
    const schema: Record<string, string> = {};

    Object.keys(firstRow).forEach(key => {
      const val = firstRow[key];
      const isNum = !isNaN(parseFloat(val)) && isFinite(val);
      if (isNum) {
        metrics.push(key);
        schema[key] = 'number';
      } else {
        dimensions.push(key);
        schema[key] = 'string';
      }
    });

    return { metrics, dimensions, schema, suggestedLayout: 'Auto-detected Dataset' };
  }

  private static async parseCSV(file: File): Promise<DetectedSource> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data as any[];
          resolve({
            type: 'csv',
            label: file.name,
            data,
            hints: this.inferSchema(data)
          });
        }
      });
    });
  }

  private static async parseJSON(file: File): Promise<DetectedSource> {
    const text = await file.text();
    try {
      let data = JSON.parse(text);
      if (!Array.isArray(data)) data = [data];
      return {
        type: 'json',
        label: file.name,
        data,
        hints: this.inferSchema(data)
      };
    } catch {
      return { type: 'json', label: file.name, data: [] };
    }
  }

  private static async parseExcel(file: File): Promise<DetectedSource> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return {
      type: 'excel',
      label: file.name,
      data: jsonData,
      hints: this.inferSchema(jsonData)
    };
  }

  private static async analyzeImage(file: File): Promise<DetectedSource> {
    try {
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      // Always create a new client right before making an API call to ensure latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { text: "Analyze this chart or table image. Extract primary metrics and dimensions. Return JSON with 'label', 'metrics', 'dimensions'." },
            { inlineData: { data: base64Data, mimeType: file.type } }
          ]
        }],
        config: { responseMimeType: "application/json" }
      });

      const analysis = JSON.parse(response.text || '{}');
      return {
        type: 'image',
        label: analysis.label || file.name,
        hints: { metrics: analysis.metrics, dimensions: analysis.dimensions }
      };
    } catch (err) {
      return { type: 'image', label: file.name };
    }
  }
}
