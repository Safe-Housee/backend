import { serializeData } from '../src/utils/serializeDataToMysql';

describe('Utils tests', () => {
    it('Deve formatar a data para o formato do mysql', () => {
        const data = '11/01/1999';
        const novaData = serializeData(data);
        expect(novaData).toBe('1999-01-11');
    });
});