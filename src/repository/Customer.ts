import { Customer } from "../entity/Customer";
import { BaseRepository } from "./BaseRepository";

class CustomerRepository extends BaseRepository<Customer, number> {
  constructor() {
    super(Customer);
  }
}

export default new CustomerRepository();
