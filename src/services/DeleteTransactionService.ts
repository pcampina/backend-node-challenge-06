import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const deleteTransactionId = await transactionRepository.findOne(id);

    if (!deleteTransactionId) throw new AppError('Transaction not exists');

    await transactionRepository.remove(deleteTransactionId);
  }
}

export default DeleteTransactionService;
