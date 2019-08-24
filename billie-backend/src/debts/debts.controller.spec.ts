import { Test, TestingModule } from '@nestjs/testing';
import { DebtsController } from './debts.controller';

describe('DebtsController', () => {
  let debtsController: DebtsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DebtsController],
      providers: [],
    }).compile();

    debtsController = app.get<DebtsController>(DebtsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(debtsController.getHello()).toBe('Hello World!');
    });
  });
});
