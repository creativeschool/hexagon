/**
 * Format date
 * @param {number} d
 */
export const formatDate = (d) => {
  const date = new Date(d)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  } else {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
  }
}
