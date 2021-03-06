package com.qa.apartment.business;

import java.util.Collection;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import com.qa.apartment.persistance.Schedule;
import com.qa.apartment.util.JSONUtil;
import com.qa.apartment.util.OwensDateValidator;

@Transactional(Transactional.TxType.SUPPORTS)
public class ScheduleDBImple implements ScheduleService {

	@PersistenceContext(unitName = "primary")
	private EntityManager em;

	@Inject
	private JSONUtil util;

	@Inject
	private OwensDateValidator odv;

	@Transactional(Transactional.TxType.REQUIRED)
	public String createScheduleFromString(String schedule) {
		Schedule aSchedule = util.getObjectForJSON(schedule, Schedule.class);
		if (aSchedule != null) {
			if (isValidScheduleDates(schedule)) {
				em.persist(aSchedule);
				return "{\"message\": \"schedule sucessfully added\"}";
			}
		}
		return "{\"message\": \"schedule not added\"}";
	}

	@Transactional(Transactional.TxType.REQUIRED)
	public String deleteSchedule(Long id) {
		em.remove(em.find(Schedule.class, id));
		return "{\"message\": \"schedule sucessfully removed\"}";
	}

	@Transactional(Transactional.TxType.REQUIRED)
	public String updateSchedule(Long id, String schedule) {
		Schedule aSchedule = util.getObjectForJSON(schedule, Schedule.class);
		Schedule selectedSchedule = util.getObjectForJSON(findSchedule(id), Schedule.class);
		if (selectedSchedule != null) {
			if (isValidScheduleDates(schedule)) {
				aSchedule.setId(selectedSchedule.getId());
				em.merge(aSchedule);
				return "{\"message\": \"schedule sucessfully updated\"}";
			}
		}
		return "{\"message\": \"schedule not updated\"}";
	}

	public String findSchedule(Long id) {
		return util.getJSONForObject(em.find(Schedule.class, id));
	}

	public String findAllSchedules() {
		TypedQuery<Schedule> query = em.createQuery("SELECT m FROM Schedule m", Schedule.class);
		Collection<Schedule> schedule = (Collection<Schedule>) query.getResultList();
		return util.getJSONForObject(schedule);
	}

	private Boolean isValidScheduleDates(String schedule) {
		String[] scheduleArray = schedule.split(",");

		String[] from_date = scheduleArray[0].split("\"");
		String[] to_date = scheduleArray[1].split("\"");

		String[] fromDateYMD = from_date[3].split("-");
		String[] toDateYMD = to_date[3].split("-");

		Boolean toReturn = false;

		if (odv.checkLogic(fromDateYMD) && odv.checkLogic(toDateYMD)) {
			toReturn = true;
		}
		return toReturn;
	}

}
