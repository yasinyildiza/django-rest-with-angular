describe('utility', function () {

  describe('string2date', function () {
    it('1997-09-15 => year: 97, month: 8, day: 15', function () {
      var string = '1997-09-15';
      var date = string2date(string);
      expect(date.getYear()).toBe(97);
      expect(date.getMonth()).toBe(8);
      expect(date.getDate()).toBe(15);
    });
  });

  describe('date2string', function () {
    it('Date(1997, 8, 15) => 1997-09-15', function () {
      var date = new Date(1997, 8, 15);
      var string = date2string(date);
      expect(string).toBe('1997-09-15');
    });

    it('Date(1997, 10, 5) => 1997-11-05', function () {
      var date = new Date(1997, 10, 5);
      var string = date2string(date);
      expect(string).toBe('1997-11-05');
    });
  });
});
