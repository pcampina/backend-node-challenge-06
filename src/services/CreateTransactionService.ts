import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let checkCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Yout budget is not suficient for this transaction.');
    }

    if (!checkCategory) {
      checkCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(checkCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
