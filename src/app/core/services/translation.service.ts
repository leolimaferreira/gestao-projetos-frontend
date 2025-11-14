import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  private readonly translations: { [key: string]: string } = {
    
    'Invalid credentials': 'Credenciais inválidas',
    'Token expired': 'Token expirado',
    'User not found': 'Usuário não encontrado',
    'User not found with email': 'Usuário não encontrado com o email',
    'Email already registered': 'Email já cadastrado',
    'Incorrect password': 'Senha incorreta',
    'Invalid email or password': 'Email ou senha inválidos',
    'Session expired': 'Sessão expirada',
    'Unauthorized': 'Não autorizado',
    'Access denied': 'Acesso negado',
    'Authentication failed': 'Falha na autenticação',
    'Invalid token': 'Token inválido',
    
    'Project not found': 'Projeto não encontrado',
    'Error creating project': 'Erro ao criar projeto',
    'Error updating project': 'Erro ao atualizar projeto',
    'Error deleting project': 'Erro ao deletar projeto',
    'Project name already exists': 'Nome do projeto já existe',
    'You do not have permission to access this project': 'Você não tem permissão para acessar este projeto',
    'Project name is required': 'Nome do projeto é obrigatório',
    'Project description is required': 'Descrição do projeto é obrigatória',
    
    'Task not found': 'Tarefa não encontrada',
    'Error creating task': 'Erro ao criar tarefa',
    'Error updating task': 'Erro ao atualizar tarefa',
    'Error deleting task': 'Erro ao deletar tarefa',
    'Task title already exists': 'Título da tarefa já existe',
    'Task title is required': 'Título da tarefa é obrigatório',
    'You can only change the status of a task to DOING if it is in status TODO.': 'Você só pode alterar o status de uma tarefa para EM PROGRESSO se ela estiver no status A FAZER.',
    'You cannot update a task to DONE less than 30 minutes after its creation': 'Você não pode atualizar uma tarefa para CONCLUÍDA em menos de 30 minutos após sua criação.',
    'You can only change the status of a task to DONE if it is in status DOING.': 'Você só pode alterar o status de uma tarefa para CONCLUÍDA se ela estiver no status EM PROGRESSO.',
    
    'Error loading users': 'Erro ao carregar usuários',
    'User without permission': 'Usuário sem permissão',
    'Email already exists': 'Email já existe',
    'User already exists': 'Usuário já existe',
    
    'Error loading data': 'Erro ao carregar dados',
    'Error saving': 'Erro ao salvar',
    'Internal server error': 'Erro interno do servidor',
    'Invalid request': 'Requisição inválida',
    'Required field': 'Campo obrigatório',
    'Invalid data': 'Dados inválidos',
    'Bad request': 'Requisição inválida',
    'Not found': 'Não encontrado',
    'Forbidden': 'Proibido',
    
    'Field cannot be empty': 'O campo não pode estar vazio',
    'Invalid email': 'Email inválido',
    'Password must be at least 6 characters': 'Senha deve ter no mínimo 6 caracteres',
    'Invalid format': 'Formato inválido',
    'Value is required': 'Valor é obrigatório',
    'Invalid value': 'Valor inválido',
    'Validation error': 'Erro de validação'
  };

  translate(message: string): string {
    if (!message) return '';
    
    let cleanMessage = message
      .replace(/^[–\-\s]+/, '')
      .replace(/^["'\s]+|["'\s]+$/g, '')
      .trim();
    
    if (this.translations[cleanMessage]) {
      return this.translations[cleanMessage];
    }
    
    if (this.translations[message]) {
      return this.translations[message];
    }
    
    let translatedMessage = cleanMessage;
    let foundTranslation = false;
    
    const sortedKeys = Object.keys(this.translations).sort((a, b) => b.length - a.length);
    
    for (const englishKey of sortedKeys) {
      if (cleanMessage.includes(englishKey)) {
        const portugueseValue = this.translations[englishKey];
        translatedMessage = translatedMessage.split(englishKey).join(portugueseValue);
        foundTranslation = true;
      }
    }
    
    if (foundTranslation) {
      return translatedMessage;
    }
    
    return cleanMessage;
  }

  translateErrors(errors: string[]): string[] {
    return errors.map(error => this.translate(error));
  }

  addTranslation(portuguese: string, english: string): void {
    this.translations[portuguese] = english;
  }
  
}
