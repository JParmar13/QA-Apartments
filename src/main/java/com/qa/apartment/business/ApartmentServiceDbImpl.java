package com.qa.apartment.business;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
//import org.apache.log4j.Logger;
import com.qa.apartment.persistance.Apartment;
import com.qa.apartment.util.JSONUtil;
import com.qa.apartment.util.OwensDateValidator;

@Transactional(Transactional.TxType.SUPPORTS)
public class ApartmentServiceDbImpl implements ApartmentService {

	// private static final Logger LOGGER =
	// Logger.getLogger(ApartmentServiceDbImpl.class);

	@PersistenceContext(unitName = "primary")
	private EntityManager em;

	@Inject
	private JSONUtil util;

	@Inject
	private OwensDateValidator odv;

	public Apartment findApartment(Long id) {
		return em.find(Apartment.class, id);
	}

	public String findAllApartments() {
		TypedQuery<Apartment> query = em.createQuery("SELECT a FROM Apartment a ORDER BY a.id", Apartment.class);
		return util.getJSONForObject(query.getResultList());
	}

	@Transactional(Transactional.TxType.REQUIRED)
	public String createApartment(String apartment) {

		Apartment newApartment = util.getObjectForJSON(apartment, Apartment.class);
		boolean check = newApartment.getBreakClause().compareTo(newApartment.getLeaseStart()) >= 0;

		/*
		if (newApartment != null) {
			if (!isValidApartmentDates(apartment)) {
				return "{\"message\": \"Apartment not sucessfully Added\", \"id\" : " + newApartment.getId() + "}";
			}
		}
		*/

		if (!check) {
			return "{\"message\": \"Break clause must be after lease start date\"}";
		}
		
		em.persist(newApartment);

		return "{\"message\": \"Apartment added\"}";

	}

	@Transactional(Transactional.TxType.REQUIRED)
	public String deleteApartment(Long id) {
		Apartment apartment = findApartment(new Long(id));
		if (apartment != null) {
			em.remove(apartment);
			return "{\"message\": \"Apartment sucessfully removed\"}";
		}
		return "{\"message\": \"Apartment wasn't removed\"}";
	}

	@Transactional(Transactional.TxType.REQUIRED)
	public String updateApartment(Long id, String newApartment) {
		Apartment apartment = util.getObjectForJSON(newApartment, Apartment.class);
		Apartment selectedApartment = findApartment(id);
		if (selectedApartment != null) {
			if (isValidApartmentDates(newApartment)) {
				apartment.setId(selectedApartment.getId());
				selectedApartment = apartment;
				em.merge(apartment);
				return "{\"message\": \"Apartment sucessfully updated\"}";
			}
		}
		return "{\"message\": \"Apartment failed to update\"}";
	}

	private Boolean isValidApartmentDates(String apartment) {
		String[] apartmentArray = apartment.split(",");

		// leaseStart 5, leaseEnd 6, breakClause 7
		String[] leaseStart = apartmentArray[5].split("\"");
		String[] leaseEnd = apartmentArray[6].split("\"");
		String[] breakClause = apartmentArray[7].split("\"");

		// date numbers 3
		String[] dates = leaseStart[3].split("-");
		String[] dates2 = leaseEnd[3].split("-");
		String[] dates3 = breakClause[3].split("-");

		Boolean toReturn = false;

		if (odv.checkLogic(dates) && odv.checkLogic(dates2) && odv.checkLogic(dates3))
			toReturn = true;

		return toReturn;
	}

	// private Boolean checkLogic(String[] dates) {
	//
	// LOGGER.info("Year: " + Integer.parseInt(dates[0]) + ". Month: " +
	// Integer.parseInt(dates[1]) + ". Day: "
	// + Integer.parseInt(dates[2]));
	//
	// if (Integer.parseInt(dates[0]) < 2015) {
	// LOGGER.info("Year is less than 2015");
	// return false;
	// }
	//
	// if (Integer.parseInt(dates[1]) > 12 || Integer.parseInt(dates[1]) < 1) {
	// LOGGER.info("Month is greater than 12 or less than 1");
	// return false;
	// }
	//
	// if (Integer.parseInt(dates[2]) < 1) {
	// LOGGER.info("Day is less than 1");
	// return false;
	// }
	//
	// if (Integer.parseInt(dates[1]) == 1 || Integer.parseInt(dates[1]) == 3 ||
	// Integer.parseInt(dates[1]) == 5
	// || Integer.parseInt(dates[1]) == 7 || Integer.parseInt(dates[1]) == 8
	// || Integer.parseInt(dates[1]) == 10 || Integer.parseInt(dates[1]) == 12) {
	// LOGGER.info("Month is 1/3/5/7/8/10/12");
	// if (Integer.parseInt(dates[2]) > 31) {
	// LOGGER.info("Days is greater than 31 on a month with 31 days");
	// return false;
	// }
	// } else if (Integer.parseInt(dates[2]) > 30) {
	// LOGGER.info("Days is greater than 30 on a month with 30 days");
	// return false;
	// }
	//
	// if (Integer.parseInt(dates[1]) == 2) {
	// LOGGER.info("Month is 2, February");
	// if ((Integer.parseInt(dates[0]) % 4) != 0 && ((Integer.parseInt(dates[0]) %
	// 200) != 0)) {
	// LOGGER.info("Year % 4 != 0 and Year % 200 != 0");
	// if (Integer.parseInt(dates[2]) > 28) {
	// LOGGER.info("Days is greater than 28 on a month with 28 days");
	// return false;
	// }
	// } else if (Integer.parseInt(dates[2]) > 29) {
	// LOGGER.info("Days is greater than 29 on a month with 29 days");
	// return false;
	// }
	// }
	//
	// return true;
	//
	// }
}